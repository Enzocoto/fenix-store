export type ProductArtworkView = 'overview' | 'waterproof' | 'grip' | 'install';

interface ProductArtworkProps {
  view?: ProductArtworkView;
  className?: string;
}

function Defs() {
  return (
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#dff0ef" />
        <stop offset="100%" stopColor="#c3dedb" />
      </linearGradient>
      <linearGradient id="seat" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2a4b4c" />
        <stop offset="100%" stopColor="#183233" />
      </linearGradient>
      <linearGradient id="cover" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#14514f" />
        <stop offset="100%" stopColor="#0b3334" />
      </linearGradient>
      <linearGradient id="dog" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f6c98a" />
        <stop offset="100%" stopColor="#d99a56" />
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#bcdcd8" stopOpacity="0.35" />
      </linearGradient>
      <radialGradient id="sun" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffe6b3" />
        <stop offset="100%" stopColor="#f2a541" />
      </radialGradient>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0b3334" floodOpacity="0.28" />
      </filter>
      <filter id="softSm" x="-30%" y="-30%" x2="160%" y2="160%">
        <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#0b3334" floodOpacity="0.22" />
      </filter>
    </defs>
  );
}

function Overview() {
  return (
    <g>
      <rect width="800" height="600" fill="url(#sky)" />

      <rect x="60" y="60" width="680" height="250" rx="26" fill="#ffffff" opacity="0.5" />
      <rect x="90" y="88" width="200" height="190" rx="18" fill="url(#glass)" stroke="#ffffff" strokeWidth="6" />
      <circle cx="250" cy="130" r="26" fill="#f2a541" opacity="0.85" />

      <rect x="40" y="330" width="720" height="210" rx="28" fill="url(#seat)" />
      <rect x="70" y="352" width="660" height="26" rx="13" fill="#0e2828" opacity="0.6" />

      <rect x="120" y="120" width="70" height="120" rx="16" fill="#173a3b" />
      <rect x="610" y="120" width="70" height="120" rx="16" fill="#173a3b" />

      <path
        d="M150 250 C 300 470, 500 470, 650 250 L 690 470 C 500 560, 300 560, 110 470 Z"
        fill="url(#cover)"
        filter="url(#soft)"
      />
      <path d="M150 250 C 300 445, 500 445, 650 250" fill="none" stroke="#f2a541" strokeWidth="9" strokeLinecap="round" />
      <g stroke="#ffffff" strokeWidth="2" opacity="0.12">
        <path d="M250 360 L250 468" />
        <path d="M340 340 L340 500" />
        <path d="M430 340 L430 500" />
        <path d="M520 340 L520 500" />
        <path d="M610 360 L610 468" />
      </g>

      <g transform="translate(300 250)">
        <ellipse cx="110" cy="200" rx="120" ry="26" fill="#0b2b2b" opacity="0.28" />
        <ellipse cx="120" cy="120" rx="104" ry="78" fill="url(#dog)" />
        <path d="M180 60 C 250 30, 280 70, 250 110" fill="none" stroke="#d99a56" strokeWidth="20" strokeLinecap="round" />
        <circle cx="120" cy="30" r="62" fill="url(#dog)" />
        <path d="M74 -6 C 46 -50, 34 -6, 60 34 Z" fill="#b9782f" />
        <path d="M166 -6 C 194 -50, 206 -6, 180 34 Z" fill="#b9782f" />
        <ellipse cx="98" cy="20" rx="10" ry="13" fill="#2a1c0c" />
        <ellipse cx="142" cy="20" rx="10" ry="13" fill="#2a1c0c" />
        <circle cx="102" cy="15" r="3.4" fill="#fff" />
        <circle cx="146" cy="15" r="3.4" fill="#fff" />
        <ellipse cx="120" cy="48" rx="20" ry="15" fill="#f2e6d2" />
        <path d="M112 44 q8 10 16 0" stroke="#2a1c0c" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="120" cy="40" rx="9" ry="7" fill="#2a1c0c" />
      </g>

      <rect x="40" y="520" width="720" height="18" rx="9" fill="#0e2828" opacity="0.25" />
    </g>
  );
}

function Waterproof() {
  return (
    <g>
      <rect width="800" height="600" fill="url(#sky)" />
      <rect x="70" y="150" width="660" height="300" rx="36" fill="url(#cover)" filter="url(#soft)" />

      <path d="M70 210 h660" stroke="#f2a541" strokeWidth="8" opacity="0.75" />

      <g fill="#ffffff" opacity="0.16">
        <ellipse cx="240" cy="300" rx="120" ry="60" />
        <ellipse cx="540" cy="360" rx="150" ry="70" />
      </g>

      <path
        d="M120 320 q70 -70 140 0 q70 70 140 0 q70 -70 140 0 q60 60 140 0"
        fill="none"
        stroke="#bfe7ee"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.9"
      />

      {[200, 340, 480, 620].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${360 + (i % 2) * 20} c -16 34, 16 44, 0 76 c -16 -32, 16 -42, 0 -76 z`} fill="#8fd3e0" />
        </g>
      ))}

      <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.6">
        <path d="M150 250 l-30 -30" />
        <path d="M640 250 l26 -26" />
      </g>
    </g>
  );
}

function Grip() {
  return (
    <g>
      <rect width="800" height="600" fill="url(#sky)" />
      <rect x="70" y="120" width="660" height="360" rx="40" fill="#123233" filter="url(#soft)" />
      <g fill="#2b5d5c" opacity="0.85">
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 11 }).map((__, col) => (
            <circle key={`${row}-${col}`} cx={120 + col * 56} cy={170 + row * 48} r="13" />
          )),
        )}
      </g>
      <path
        d="M70 120 C 240 60, 560 60, 730 120 L 730 300 C 560 250, 240 250, 70 300 Z"
        fill="url(#cover)"
        filter="url(#soft)"
      />
      <path d="M110 205 C 300 155, 500 155, 690 205" fill="none" stroke="#f2a541" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
    </g>
  );
}

function Install() {
  return (
    <g>
      <rect width="800" height="600" fill="url(#sky)" />
      <rect x="110" y="90" width="580" height="58" rx="29" fill="#123233" filter="url(#soft)" />
      <rect x="170" y="128" width="70" height="150" rx="18" fill="#173a3b" />
      <rect x="560" y="128" width="70" height="150" rx="18" fill="#173a3b" />

      <path d="M205 250 q -12 90 60 120" fill="none" stroke="#f2a541" strokeWidth="14" strokeLinecap="round" />
      <path d="M595 250 q 12 90 -60 120" fill="none" stroke="#f2a541" strokeWidth="14" strokeLinecap="round" />

      <rect x="180" y="360" width="440" height="30" rx="15" fill="#8a6420" />

      <path d="M150 380 C 300 540, 500 540, 650 250 L 690 470 C 500 570, 300 560, 110 470 Z" fill="url(#cover)" filter="url(#soft)" />
      <circle cx="205" cy="250" r="22" fill="#f2a541" stroke="#0b3334" strokeWidth="6" />
      <circle cx="595" cy="250" r="22" fill="#f2a541" stroke="#0b2f30" strokeWidth="6" />
      <circle cx="205" cy="250" r="7" fill="#0e2828" />
      <circle cx="595" cy="250" r="7" fill="#0e2828" />
    </g>
  );
}

export function ProductArtwork({ view = 'overview', className }: ProductArtworkProps) {
  const label = {
    overview: 'Illustration of the back-seat hammock cover in a car',
    waterproof: 'Illustration of the waterproof top layer of the cover',
    grip: 'Illustration of the anti-slip backing of the cover',
    install: 'Illustration of the headrest install straps',
  }[view];

  return (
    <svg
      className={className}
      viewBox="0 0 800 600"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Defs />
      {view === 'overview' && <Overview />}
      {view === 'waterproof' && <Waterproof />}
      {view === 'grip' && <Grip />}
      {view === 'install' && <Install />}
    </svg>
  );
}
