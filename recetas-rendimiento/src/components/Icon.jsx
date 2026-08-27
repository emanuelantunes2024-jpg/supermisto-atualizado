// Íconos SVG livianos (estilo lineal) — sin dependencias externas.
const paths = {
  home: 'M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM4 20.5A2.5 2.5 0 0 1 6.5 18H20',
  grid: 'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z',
  search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-5.5-5.5',
  calculator: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 4h8M8 11h1m3 0h1m3 0h1M8 15h1m3 0h1m3 0h1M8 19h8',
  cart: 'M3 4h2l2.4 12.2a2 2 0 0 0 2 1.8h7.8a2 2 0 0 0 2-1.6L21 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  trending: 'm3 17 6-6 4 4 8-8M15 6h6v6',
  heart: 'M12 21s-7.5-4.6-10-9.3C.5 8 2.2 4.5 5.7 4A5 5 0 0 1 12 7a5 5 0 0 1 6.3-3c3.5.5 5.2 4 3.7 7.7C19.5 16.4 12 21 12 21Z',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z',
  bell: 'M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9ZM9.5 17a2.5 2.5 0 0 0 5 0',
  chef: 'M8 21h8M9 21v-6.5M15 21v-6.5M6.5 10A3.5 3.5 0 0 1 9 4a3 3 0 0 1 6 0 3.5 3.5 0 0 1 2.5 6c0 2.5-1 4-3 4.5H9c-2-.5-2.5-2-2.5-4.5Z',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a7.97 7.97 0 0 0-.2-1.8l2-1.6-2-3.4-2.3.9a8 8 0 0 0-3.1-1.8L14 2h-4l-.4 2.3a8 8 0 0 0-3.1 1.8l-2.3-.9-2 3.4 2 1.6a8.2 8.2 0 0 0 0 3.6l-2 1.6 2 3.4 2.3-.9a8 8 0 0 0 3.1 1.8L10 22h4l.4-2.3a8 8 0 0 0 3.1-1.8l2.3.9 2-3.4-2-1.6c.13-.6.2-1.2.2-1.8Z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  plus: 'M12 5v14M5 12h14',
  pencil: 'm16.5 4.5 3 3L7 20H4v-3L16.5 4.5Z',
  trash: 'M4 7h16M9 7V4h6v3m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  eyeOff: 'M3 3l18 18M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.9 17.9 0 0 1-3.4 4.3M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4-.8M9.9 9.9a3 3 0 0 0 4.2 4.2',
  star: 'm12 3 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.9 6.1 21l1.2-6.5-4.8-4.6 6.6-.9L12 3Z',
  chevronDown: 'm6 9 6 6 6-6',
  chevronLeft: 'm15 18-6-6 6-6',
  chevronRight: 'm9 18 6-6-6-6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  x: 'M18 6 6 18M6 6l12 12',
  check: 'm5 13 4 4L19 7',
  share: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14',
  minus: 'M5 12h14',
  dashboard: 'M4 4h7v9H4V4Zm9 0h7v5h-7V4ZM4 17h7v3H4v-3Zm9-4h7v7h-7v-7Z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  tag: 'M20.6 12.6 12.7 20.5a2 2 0 0 1-2.8 0l-6.4-6.4a2 2 0 0 1 0-2.8L11.4 3.4 20.6 3v9.6ZM8 8h.01',
  report: 'M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6H8Zm6 0v6h6M9 13h6M9 17h6',
  sparkles: 'm12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Zm7 9 .8 2.2L22 15l-2.2.8L19 18l-.8-2.2L16 15l2.2-.8L19 12ZM5 13l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z',
  crown: 'm3 8 4 3 5-6 5 6 4-3-2 11H5L3 8Z',
  bolt: 'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 3',
  scale: 'M12 3v18M7 7l-4 8a4 4 0 0 0 8 0l-4-8Zm10 0-4 8a4 4 0 0 0 8 0l-4-8ZM5 7h14',
  download: 'M12 3v12m0 0 4-4m-4 4-4-4M5 21h14',
  upload: 'M12 21V9m0 0 4 4m-4-4-4 4M5 3h14',
  image: 'M4 5h16v14H4V5Zm3 10 3.5-4 3 3L17 10l3 4M8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
};

export default function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.8, filled = false }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
