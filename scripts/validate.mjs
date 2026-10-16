import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import AxeBuilder from '@axe-core/playwright';

const playwrightOption = process.argv.indexOf('--playwright');
const { chromium, webkit } = await import(
  playwrightOption === -1 ? 'playwright' : process.argv[playwrightOption + 1]
);

const address = '7eJWuvU1JHskxsRNFomerJLHdjoiHR6QhSTm7GgH7rU3';
const launchUrl = `https://lindylaunch.fun/r/${address}`;
const root = resolve('dist');
const output = resolve('test/scratch/interactions');
await mkdir(output, { recursive: true });
const report = {
  checks: [],
  limitations: [],
  viewports: [],
  generatedAt: new Date().toISOString(),
};
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname,
    );
    if (!pathname.startsWith('/preview/')) {
      response.writeHead(404).end();
      return;
    }
    const relative = pathname.slice('/preview/'.length) || 'index.html';
    const file = resolve(root, relative);
    if (!file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    const body = await readFile(file);
    response
      .writeHead(200, {
        'Content-Type': types[extname(file)] || 'application/octet-stream',
      })
      .end(body);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const url = `${origin}/preview/`;

async function check(name, action) {
  try {
    const detail = await action();
    report.checks.push({ name, passed: true, detail });
    console.log(`PASS ${name}`);
  } catch (error) {
    report.checks.push({ name, passed: false, detail: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

try {
  for (const [engine, browserType] of [
    ['chromium', chromium],
    ['webkit', webkit],
  ]) {
    let browser;
    try {
      browser = await browserType.launch({ headless: true });
    } catch (error) {
      report.limitations.push(
        `${engine} could not launch; that engine's rendered behavior is unverified.`,
      );
      console.log(
        `UNAVAILABLE ${engine}: host browser dependencies are missing.`,
      );
      continue;
    }
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'no-preference',
      acceptDownloads: true,
    });
    // The static site must render with all foreign origins blocked. External destination checks
    // below intercept navigation only; they do not pretend to verify the third-party service.
    await context.route('**/*', (route) =>
      route.request().url().startsWith(origin)
        ? route.continue()
        : route.abort(),
    );
    const page = await context.newPage();
    const errors = [],
      failures = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('response', (response) => {
      if (response.url().startsWith(origin) && response.status() >= 400)
        failures.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    await check(`${engine}: first screen at 390`, async () => {
      const product = await page.locator('h1').boundingBox();
      const mainAction = await page
        .getByRole('link', {
          name: 'Explore LinD on LindyLaunch (opens in a new tab)',
          exact: true,
        })
        .boundingBox();
      const contract = await page.locator('code').boundingBox();
      assert(product.y + product.height < 844);
      assert(mainAction.y + mainAction.height < 844);
      assert(contract.y + contract.height < 844);
      assert.equal(await page.locator('code').textContent(), address);
      return { product, mainAction, contract };
    });

    await check(`${engine}: mobile menu keyboard and escape`, async () => {
      const menu = page.locator('.menu-toggle');
      await menu.focus();
      await page.keyboard.press('Enter');
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      assert.equal(
        await menu.evaluate((el) => el === document.activeElement),
        true,
      );
      await menu.click();
      await page
        .getByRole('navigation', { name: 'Mobile navigation', exact: true })
        .getByRole('link', { name: 'The ocean', exact: true })
        .click();
      assert.equal(new URL(page.url()).hash, '#ocean');
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      return 'Enter opens, Escape closes and restores focus; selecting a section closes the menu and navigates.';
    });

    await check(`${engine}: external primary navigation`, async () => {
      await context.route(launchUrl, (route) =>
        route.fulfill({
          contentType: 'text/html',
          body: '<title>Navigation test destination</title>',
        }),
      );
      const popupPromise = context.waitForEvent('page');
      await page
        .getByRole('link', {
          name: 'Explore LinD on LindyLaunch (opens in a new tab)',
          exact: true,
        })
        .click();
      const popup = await popupPromise;
      await popup.waitForLoadState();
      assert.equal(popup.url(), launchUrl);
      assert.equal(await popup.evaluate(() => window.opener), null);
      await popup.close();
      return 'Click opened the exact supplied token URL with no opener. Destination intercepted; no trade or wallet interaction attempted.';
    });

    await check(`${engine}: Watermap navigation and fee plan`, async () => {
      await page.getByRole('link', { name: 'Read the Watermap', exact: true }).click();
      assert.equal(new URL(page.url()).hash, '#watermap');
      const map = page.getByRole('region', { name: 'Our Watermap.' });
      await map.scrollIntoViewIfNeeded();
      assert.equal(await map.isVisible(), true);
      const steps = await map.locator('li').allTextContents();
      assert.equal(steps.length, 3);
      assert.match(steps[0], /All creator fees will be used to create LinD\/Lindy and LinD\/SOL\s+liquidity pools/);
      assert.match(steps[1], /will be set up to autocompound on Meteora/);
      assert.match(steps[2], /Once LinD is liquid enough/);
      assert.match(steps[2], /bonding new launches on Lindy/);
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(new URL(page.url()).hash, '#watermap');
      assert.equal(await map.isVisible(), true);
      await page.locator('.menu-toggle').click();
      await page.getByRole('navigation', { name: 'Mobile navigation', exact: true })
        .getByRole('link', { name: 'Watermap', exact: true }).click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await map.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${output}/${engine}-watermap-390.png` });
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      return 'Hero and mobile navigation reach the three-step plan; a direct hash reload works under /preview/. Both pairs, Meteora autocompounding and the liquidity condition are visible.';
    });

    await check(`${engine}: supplied mermaid and share metadata`, async () => {
      const hero = page.locator('.hero-art > img');
      assert.equal(await hero.getAttribute('src'), './art/mermaid-reference.png');
      assert.equal(await hero.evaluate((img) => img.naturalWidth), 1254);
      assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), './art/mermaid-reference.png');
      assert.equal(await page.locator('meta[name="description"]').getAttribute('content').then((text) => text.includes('Watermap')), true);
      assert((await stat(resolve(root, 'art/mermaid-reference.png'))).size > 0);
      return 'The supplied 1254px illustration is the local hero, story image and social image; metadata describes the Watermap.';
    });

    await check(`${engine}: copy address success`, async () => {
      if (engine === 'chromium')
        await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
          origin,
        });
      else
        await page.evaluate(() =>
          Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: {
              writeText: async (text) => {
                window.__copied = text;
              },
            },
          }),
        );
      await page
        .getByRole('button', { name: 'Copy contract address', exact: true })
        .click();
      await page
        .getByRole('status')
        .filter({ hasText: 'Address copied' })
        .waitFor();
      const actual = await page.evaluate(
        engine === 'chromium'
          ? () => navigator.clipboard.readText()
          : () => window.__copied,
      );
      assert.equal(actual, address);
      return engine === 'chromium'
        ? 'Real browser clipboard contains the exact address; success is announced.'
        : 'Clipboard API stub contains the exact address; OS clipboard is not verified in WebKit.';
    });

    await check(
      `${engine}: copy denied and recoverable manual selection`,
      async () => {
        await page.evaluate(() =>
          Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: {
              writeText: async () => {
                throw new Error('Permission denied');
              },
            },
          }),
        );
        await page.locator('.copy-button').click();
        await page
          .getByRole('status')
          .filter({ hasText: 'copy it manually' })
          .waitFor();
        assert.equal(
          await page.evaluate(() => window.getSelection()?.toString()),
          address,
        );
        assert.equal(
          await page
            .getByRole('button', { name: 'Copy contract address', exact: true })
            .isEnabled(),
          true,
        );
        return 'Denied clipboard shows persistent recovery instructions and selects the complete address.';
      },
    );

    await check(`${engine}: artwork download`, async () => {
      const downloadPromise = page.waitForEvent('download');
      await page
        .getByRole('link', { name: 'Save the artwork', exact: true })
        .click();
      const download = await downloadPromise;
      assert.equal(download.suggestedFilename(), 'LinD-underwater-world.webp');
      assert.equal(await download.failure(), null);
      assert.equal(
        (await stat(await download.path())).size,
        (await stat(resolve(root, 'art/ocean.webp'))).size,
      );
      return 'The complete local WebP downloads with the intended filename and byte count.';
    });

    await check(`${engine}: FAQ keyboard disclosure`, async () => {
      const summary = page.locator('summary').first();
      await summary.focus();
      await page.keyboard.press('Enter');
      assert.equal(
        await page.locator('details').first().getAttribute('open'),
        '',
      );
      assert.equal(
        await page.locator('details').first().locator('p').isVisible(),
        true,
      );
      await page.keyboard.press('Space');
      assert.equal(
        await page.locator('details').first().getAttribute('open'),
        null,
      );
      return 'Native details open with Enter and close with Space.';
    });

    await check(`${engine}: motion controls and reduced motion`, async () => {
      await page
        .getByRole('button', { name: 'Pause ocean', exact: true })
        .click();
      assert.equal(
        await page
          .locator('.hero-art > img')
          .evaluate((el) => getComputedStyle(el).animationPlayState),
        'paused',
      );
      await page
        .getByRole('button', { name: 'Play ocean', exact: true })
        .click();
      assert.equal(
        await page
          .locator('.hero-art > img')
          .evaluate((el) => getComputedStyle(el).animationPlayState),
        'running',
      );
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page
        .getByRole('button', { name: 'Motion reduced', exact: true })
        .waitFor();
      assert.equal(
        await page
          .getByRole('button', { name: 'Motion reduced', exact: true })
          .isDisabled(),
        true,
      );
      const running = await page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.playState === 'running').length,
      );
      assert.equal(running, 0);
      return 'Manual pause/resume works; reduced-motion removes all active animations and clearly labels the disabled motion control.';
    });

    await check(`${engine}: responsive layout and local assets`, async () => {
      for (const width of [320, 390, 720, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            [...document.images].map((image) => image.decode().catch(() => {})),
          );
        });
        const layout = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          scroll: document.documentElement.scrollWidth,
          loaded: [...document.images].every(
            (image) => image.complete && image.naturalWidth > 0,
          ),
          fonts: [...document.fonts].map((font) => ({
            family: font.family,
            status: font.status,
          })),
        }));
        assert(
          layout.scroll <= width,
          `Overflow at ${width}: ${layout.scroll}`,
        );
        assert.equal(layout.loaded, true);
        assert(layout.fonts.every((font) => font.status === 'loaded'));
        report.viewports.push({ engine, width, ...layout });
      }
      return '320, 390, 720, 768, 1024 and 1440 pixels: no horizontal overflow, local images decoded, local fonts loaded under /preview/ with foreign origins blocked.';
    });

    await check(
      `${engine}: 200% text and text-spacing resilience`,
      async () => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.addStyleTag({
          content: 'html { font-size: 200% !important; }',
        });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          '200% text causes horizontal overflow',
        );
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.addStyleTag({
          content:
            '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }',
        });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          'Increased text spacing causes horizontal overflow',
        );
        return '200% root text size and WCAG text-spacing override retain horizontal reflow. This is not browser-native zoom.';
      },
    );

    await check(
      `${engine}: accessibility scan, collapsed and expanded`,
      async () => {
        await page.goto(url, { waitUntil: 'networkidle' });
        const collapsed = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        assert.deepEqual(
          collapsed.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          [],
        );
        await page
          .getByRole('button', { name: 'Open navigation', exact: true })
          .click();
        for (const summary of await page.locator('summary').all())
          await summary.click();
        const expanded = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        assert.deepEqual(
          expanded.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          [],
        );
        return {
          collapsedViolations: 0,
          expandedViolations: 0,
          needsManualReview: [
            ...new Set(
              [...collapsed.incomplete, ...expanded.incomplete].map(
                (item) => item.id,
              ),
            ),
          ],
        };
      },
    );

    await check(`${engine}: console and resource health`, async () => {
      assert.deepEqual(errors, []);
      assert.deepEqual(failures, []);
      return 'No page errors, console errors or failed local HTTP responses throughout the interaction checks.';
    });

    await page.goto(url, { waitUntil: 'networkidle' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [width, height] of [
      [390, 844],
      [1440, 900],
    ]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map((image) => image.decode().catch(() => {})),
        );
      });
      await page.screenshot({
        path: `${output}/${engine}-${width}.png`,
        fullPage: false,
      });
      await page.screenshot({
        path: `${output}/${engine}-${width}-full.png`,
        fullPage: true,
      });
    }
    await context.close();
    await browser.close();
  }
} finally {
  server.closeAllConnections();
  await new Promise((done) => server.close(done));
  await writeFile(
    `${output}/results.json`,
    JSON.stringify(report, null, 2) + '\n',
  );
}
console.log(
  JSON.stringify({
    passed: report.checks.filter((check) => check.passed).length,
    failed: report.checks.filter((check) => !check.passed).length,
    limitations: report.limitations.length,
  }),
);
if (!report.checks.length || report.checks.some((check) => !check.passed))
  process.exitCode = 1;
