import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Morrow — Everyday objects, considered', description: 'Thoughtful goods for a slower, better everyday.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
