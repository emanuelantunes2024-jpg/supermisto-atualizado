// Ícones outline minimalistas desenhados à mão (sem dependência externa),
// no estilo usado nas duas referências visuais (traço fino, 1.8px).
import type { SVGProps } from 'react';

const paths: Record<string, string> = {
  home: 'M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9',
  book: 'M5 4.5A1.5 1.5 0 0 1 6.5 3H19v16H6.5A1.5 1.5 0 0 0 5 20.5V4.5ZM5 20.5A1.5 1.5 0 0 1 6.5 19H19',
  wheat: 'M12 3v18M8 7l4-2 4 2M8 12l4-2 4 2M8 17l4-2 4 2',
  grid: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
  users: 'M8 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm9-1a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5M14 20c.4-2.6 2-4.4 4.3-5.1 1.9.4 3.3 2 3.7 5.1',
  card: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 3h18',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6M9 11h6M9 14h4',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-3.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  calculator: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 3h10v3H7V6Zm0 5.5h2v2H7v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2ZM7 15.5h2v2H7v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Z',
  cart: 'M3 4h2l2.2 11.4A2 2 0 0 0 9.2 17h7.6a2 2 0 0 0 2-1.6L20.5 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  heart: 'M12 20.5s-7.5-4.6-9.6-9.2C1 8 2.3 4.7 5.5 4a4.9 4.9 0 0 1 6.5 2.2A4.9 4.9 0 0 1 18.5 4c3.2.7 4.5 4 3.1 7.3-2.1 4.6-9.6 9.2-9.6 9.2Z',
  folder: 'M3 6.5A1.5 1.5 0 0 1 4.5 5H10l2 2h7.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11Z',
  sparkle: 'M12 3l1.8 4.9L19 9.7l-4.9 1.8L12 16.4l-1.8-4.9L5 9.7l4.9-1.8L12 3ZM19 15l.9 2.4L22.3 18l-2.4.9L19 21.3l-.9-2.4L15.7 18l2.4-.9L19 15Z',
  bell: 'M6 9a6 6 0 1 1 12 0v5l1.6 2.4H4.4L6 14V9Zm4.3 12a1.9 1.9 0 0 0 3.4 0',
  bot: 'M9 3v3M15 3v3M5 9h14a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a1 1 0 0 1 1-1Zm3 5v2m6-2v2M9 17h6',
  chat: 'M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  image: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm2 12 4.5-5 3 3.2L17 10l3 7H6Zm.5-8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  chart: 'M4 20V10m6 10V4m6 16v-7m6 7V8',
  lifebuoy: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM6.3 6.3l3 3m5.4 5.4 3 3m0-11.4-3 3m-5.4 5.4-3 3',
  shield: 'M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Zm-3 9 2 2 4-4',
  key: 'M14.5 9.5a4 4 0 1 0-3.9 4h.4L15 17.5 17 16l1.5 1.5L21 15l-1.5-1.5 1-1-2-2-3.8 3.8a4 4 0 0 0-.2-4.8Z',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  gear: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8-3.5a8 8 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a8 8 0 0 0-2-1.2L15 3H9l-.5 2.6a8 8 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A8 8 0 0 0 4 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1c.6.5 1.3.9 2 1.2L9 21h6l.5-2.6c.7-.3 1.4-.7 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z',
  logout: 'M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H9',
  search: 'm21 21-4.3-4.3M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  moon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  chevronDown: 'm6 9 6 6 6-6',
  chevronRight: 'm9 6 6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z',
  trash: 'M4 7h16M9 7V4h6v3m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13',
  copy: 'M9 9h10v10H9V9Zm0 0V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-4',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  star: 'm12 3 2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 20l1.4-6.3-4.8-4.3 6.4-.6L12 3Z',
  check: 'm5 12 5 5 9-9',
  x: 'M18 6 6 18M6 6l12 12',
  download: 'M12 3v13m0 0-4-4m4 4 4-4M5 21h14',
  filter: 'M4 5h16l-6 8v6l-4-2v-4L4 5Z',
  scale: 'M12 3v3m0 15v-3M4.5 8 12 6l7.5 2M4.5 8 2 14h5l-2.5-6Zm15 0L22 14h-5l2.5-6ZM8 21h8',
  whatsapp: 'M6 21l1.4-3.7A8 8 0 1 1 21 12a8 8 0 0 1-11.6 7.1L6 21Zm4-8.5c.7 1.8 2 3 3.7 3.6l1-1c1.2.4 2 .6 2 .6s.2 1.7-.5 2.2c-.8.6-2.9.3-5.3-1.6-2-1.6-3.1-3.4-3.4-4.3-.3-1 0-1.7.6-2.2.6-.4 1.4-.3 1.4-.3l.6 2.1-1 1Z',
  storefront: 'M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9M3 5h18l1 5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0L3 5Z',
  truck: 'M3 6h11v9H3V6Zm11 3h4l3 3v3h-7V9ZM6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  building: 'M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M4 21h16m-4 0v-6h-6v6M8 7h1m3 0h1m-5 4h1m3 0h1',
  ticket: 'M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z',
  trending: 'm3 17 6-6 4 4 8-8m0 0h-5m5 0v5',
  upload: 'M12 21V8m0 0-4 4m4-4 4 4M5 21h14',
};

export type IconName = keyof typeof paths;

export function Icon({ name, className, ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
