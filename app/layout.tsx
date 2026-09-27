import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commerce Control Room',
  description: 'Manage your commerce catalog, orders, customers, and operations.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
