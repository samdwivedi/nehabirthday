import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Neha's Birthday — The Chota Don Chronicles",
  description: 'A little universe, made with love, just for Neha.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
