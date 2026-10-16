type IconName =
  | 'arrow'
  | 'down'
  | 'copy'
  | 'check'
  | 'pause'
  | 'play'
  | 'menu'
  | 'close'
  | 'download'
  | 'plus'
  | 'wave';

export function Icon({
  name,
  className = '',
}: {
  name: IconName;
  className?: string;
}) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M6 18 18 6M6 6h12v12" />
      </>
    ),
    down: (
      <>
        <path d="M12 4v16m-6-6 6 6 6-6" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="13" rx="2" />
        <path d="M16 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    pause: (
      <>
        <path d="M8 5v14M16 5v14" strokeWidth="3" />
      </>
    ),
    play: <path d="m8 4 11 8-11 8Z" />,
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    wave: (
      <>
        <path d="M2 8c4-6 6 6 10 0s6 6 10 0M2 16c4-6 6 6 10 0s6 6 10 0" />
      </>
    ),
  };
  return (
    <svg
      className={`icon ${className}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function Seahorse({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="38"
      height="46"
      viewBox="0 0 52 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M30 12c-8-4-17 1-17 9l-7 6 12 3c1 6 8 8 12 14 5 9-5 15-10 10-4-4 0-8 4-6" />
      <path d="M29 11l6 6-3 8 7 8-3 5c8 15-6 26-17 19M16 31l-4 7 10 2M18 14l-3-6M24 11l1-6" />
      <path d="M22 21h.01" strokeWidth="3.5" />
      <path d="m32 25 5-2m0 10 5-2m-8 15 5 1m-7 8 2 4" />
    </svg>
  );
}
