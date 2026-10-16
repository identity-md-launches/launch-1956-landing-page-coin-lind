import { useEffect, useRef, useState } from 'react';
import { CONTRACT_ADDRESS, EXPLORER_URL, LAUNCH_URL } from './config';
import { Icon, Seahorse } from './Icons';

const navigation = [
  { href: '#watermap', label: 'Watermap' },
  { href: '#story', label: 'The story' },
  { href: '#ocean', label: 'The ocean' },
  { href: '#find-lind', label: 'Find LinD' },
];

function LaunchLink({
  secondary = false,
  children = 'Explore LinD',
}: {
  secondary?: boolean;
  children?: React.ReactNode;
}) {
  const label = typeof children === 'string' ? children : 'Explore LinD';
  return (
    <a
      className={`button ${secondary ? 'button-outline' : 'button-primary'}`}
      href={LAUNCH_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}${label.includes('LindyLaunch') ? '' : ' on LindyLaunch'} (opens in a new tab)`}
    >
      {children}
      <Icon name="arrow" />
    </a>
  );
}

function ContractAddress() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const addressRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copyAddress() {
    if (timer.current) clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setStatus('copied');
      timer.current = setTimeout(() => setStatus('idle'), 3500);
    } catch {
      setStatus('error');
      const range = document.createRange();
      if (addressRef.current) {
        range.selectNodeContents(addressRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }

  return (
    <div className="contract-block">
      <div className="contract-label">
        <span>Contract address</span>
        <span className="network-mark">
          <span aria-hidden="true" />
          Solana
        </span>
      </div>
      <div className="contract-value">
        <code ref={addressRef}>{CONTRACT_ADDRESS}</code>
        <button
          type="button"
          className="copy-button"
          onClick={copyAddress}
          aria-label={
            status === 'copied'
              ? 'Contract address copied'
              : 'Copy contract address'
          }
        >
          <Icon name={status === 'copied' ? 'check' : 'copy'} />
        </button>
      </div>
      <p
        className={`copy-status ${status === 'error' ? 'copy-error' : ''}`}
        role="status"
      >
        {status === 'copied'
          ? 'Address copied. You’re ready to explore.'
          : status === 'error'
            ? 'Copy is unavailable. Select the address above and copy it manually.'
            : ''}
      </p>
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 720) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <a className="wordmark" href="#top" aria-label="LinD home">
          <Seahorse />
          <span>
            LinD<span className="wordmark-dot">.</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="header-launch"
            href={LAUNCH_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on LindyLaunch
            <Icon name="arrow" />
          </a>
          <button
            className="menu-toggle"
            ref={toggleRef}
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!menuOpen}
      >
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
            <Icon name="arrow" />
          </a>
        ))}
      </nav>
    </header>
  );
}

function useOceanMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(preference.matches);
    preference.addEventListener('change', onChange);
    return () => preference.removeEventListener('change', onChange);
  }, []);
  return {
    paused: paused || reduced,
    reduced,
    toggle: () => setPaused((previous) => !previous),
  };
}

function Watermap() {
  return (
    <section
      className="watermap section"
      id="watermap"
      aria-labelledby="watermap-title"
    >
      <div className="container">
        <div className="watermap-heading">
          <h2 id="watermap-title">Our <em>Watermap.</em></h2>
          <p>A plan for deeper liquidity and new Lindy launches.</p>
        </div>
        <ol className="watermap-steps">
          <li>
            <span className="watermap-number" aria-hidden="true">01</span>
            <h3>Build the liquidity</h3>
            <p>
              All creator fees will be used to create LinD/Lindy and LinD/SOL
              liquidity pools (LPs).
            </p>
            <div className="watermap-pairs">
              <span>LinD / Lindy</span>
              <Icon name="plus" />
              <span>LinD / SOL</span>
            </div>
          </li>
          <li>
            <span className="watermap-number" aria-hidden="true">02</span>
            <h3>Keep the pools growing</h3>
            <p>
              These pools will be set up to autocompound on Meteora,
              reinvesting fees into the LP. As the ecosystem grows, so does
              the liquidity.
            </p>
          </li>
          <li>
            <span className="watermap-number" aria-hidden="true">03</span>
            <h3>Help new launches surface</h3>
            <p>
              Once LinD is liquid enough, we will direct creator fees toward
              bonding new launches on Lindy.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function App() {
  const { paused, reduced, toggle } = useOceanMotion();
  return (
    <div id="top" className={`site ${paused ? 'motion-paused' : ''}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-art" aria-hidden="true">
            <img
              src="./art/mermaid-reference.png"
              alt=""
              width="1254"
              height="1254"
              fetchPriority="high"
            />
            <div className="hero-shade" />
            <div className="bubbles">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} style={{ '--i': i } as React.CSSProperties} />
              ))}
            </div>
          </div>
          <div className="hero-inner container">
            <div className="hero-copy">
              <h1 id="hero-title">
                Let yourself
                <br />
                <em>drift into LinD.</em>
              </h1>
              <p className="hero-description">
                A mermaid-inspired coin making waves on Solana.
              </p>
              <div className="hero-actions">
                <LaunchLink />
                <a className="text-link" href="#watermap">
                  Read the Watermap
                  <Icon name="down" />
                </a>
              </div>
              <ContractAddress />
            </div>
            <div className="hero-bottom">
              <a className="scroll-link" href="#watermap">
                <span className="scroll-line" aria-hidden="true" />
                There’s more beneath the surface
                <Icon name="down" />
              </a>
              <button
                className="motion-control"
                type="button"
                onClick={toggle}
                aria-pressed={paused}
                disabled={reduced}
              >
                <Icon name={paused ? 'play' : 'pause'} />
                <span>
                  {reduced
                    ? 'Motion reduced'
                    : paused
                      ? 'Play ocean'
                      : 'Pause ocean'}
                </span>
              </button>
            </div>
          </div>
        </section>

        <Watermap />

        <section
          className="story section container"
          id="story"
          aria-labelledby="story-title"
        >
          <div className="story-art">
            <img
              src="./art/mermaid-reference.png"
              width="1254"
              height="1254"
              alt="A red-haired anime mermaid with a curled seahorse tail, holding a diamond in a turquoise underwater world."
              loading="lazy"
            />
          </div>
          <div className="story-copy">
            <Seahorse className="section-seahorse" />
            <h2 id="story-title">
              A little coin.
              <br />
              <em>A whole ocean.</em>
            </h2>
            <p>Somewhere between the sea and your imagination, there’s LinD.</p>
            <p>
              Fiery red hair, a seahorse’s curl and an ocean of blue.
              We’re bringing a little ocean magic to Solana.
              Come on in. The water’s lovely.
            </p>
            <a href="#ocean" className="text-link">
              Meet the underwater world
              <Icon name="down" />
            </a>
          </div>
        </section>

        <section
          className="ocean-section section"
          id="ocean"
          aria-labelledby="ocean-title"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <h2 id="ocean-title">
                  Find your <em>blue.</em>
                </h2>
                <p>A world made for daydreaming. A little piece to keep.</p>
              </div>
              <a
                className="button button-outline"
                href="./art/ocean.webp"
                download="LinD-underwater-world.webp"
              >
                Save the artwork
                <Icon name="download" />
              </a>
            </div>
            <figure className="ocean-gallery">
              <img
                src="./art/ocean.webp"
                alt="Six blue and lavender-haired anime mermaids swimming through sunlit blue water, with seahorses and a luminous coral reef."
                width="1536"
                height="1024"
                loading="lazy"
              />
              <figcaption>
                <span>The world of LinD</span>
                <span>
                  Follow the current.
                  <Icon name="wave" />
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          className="find-section section container"
          id="find-lind"
          aria-labelledby="find-title"
        >
          <div className="find-intro">
            <h2 id="find-title">
              Ready to
              <br />
              <em>take the plunge?</em>
            </h2>
            <p>Your way into LinD starts here.</p>
            <LaunchLink>Visit LindyLaunch</LaunchLink>
          </div>
          <ol className="steps">
            <li>
              <span className="step-number">01</span>
              <div>
                <h3>Know your LinD</h3>
                <p>
                  Match the full contract address on this page. The address is
                  the surest way to identify the token.
                </p>
                <a
                  className="text-link"
                  href={EXPLORER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Check on Solana Explorer
                  <Icon name="arrow" />
                </a>
              </div>
            </li>
            <li>
              <span className="step-number">02</span>
              <div>
                <h3>Explore on LindyLaunch</h3>
                <p>
                  Visit the token’s launch page for current market information
                  and available trading options.
                </p>
              </div>
            </li>
            <li>
              <span className="step-number">03</span>
              <div>
                <h3>Go at your own pace</h3>
                <p>
                  Take a look around, enjoy the art and decide whether LinD is
                  for you.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section
          className="questions container"
          aria-labelledby="questions-title"
        >
          <h2 id="questions-title">
            A few things
            <br />
            <em>below the surface.</em>
          </h2>
          <div className="faq-list">
            <details>
              <summary>
                What is LinD?
                <Icon name="plus" />
              </summary>
              <p>
                LinD is a mermaid-inspired coin on Solana. This page introduces
                its underwater world and links to the token’s LindyLaunch page.
              </p>
            </details>
            <details>
              <summary>
                What is the Watermap?
                <Icon name="plus" />
              </summary>
              <p>
                It’s our plan to use creator fees to build liquidity first,
                then support new launches as LinD’s liquidity develops.
              </p>
              <a className="text-link" href="#watermap">
                Read the fee plan
                <Icon name="down" />
              </a>
            </details>
            <details>
              <summary>
                Where can I find the contract?
                <Icon name="plus" />
              </summary>
              <p>
                The full contract address is displayed at the top of this page.
                Use the copy button, or follow the Solana Explorer link to
                inspect it.
              </p>
              <a className="text-link" href="#top">
                Go to the contract address
                <Icon name="arrow" />
              </a>
            </details>
            <details>
              <summary>
                Do I need to connect a wallet?
                <Icon name="plus" />
              </summary>
              <p>
                You can explore this site and save the artwork without a wallet.
                Any trading happens on LindyLaunch, where you can review the
                available options.
              </p>
            </details>
          </div>
        </section>
      </main>
      <footer className="site-footer container">
        <div className="footer-main">
          <a href="#top" className="wordmark" aria-label="LinD home">
            <Seahorse />
            <span>
              LinD<span className="wordmark-dot">.</span>
            </span>
          </a>
          <p>A little ocean magic.</p>
          <a className="text-link" href="#top">
            Back to the surface
            <Icon name="arrow" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>LinD · On Solana</span>
          <span>An ocean to explore. A choice that’s yours.</span>
          <a href={EXPLORER_URL} target="_blank" rel="noopener noreferrer">
            Solana Explorer
            <Icon name="arrow" />
          </a>
        </div>
      </footer>
    </div>
  );
}
