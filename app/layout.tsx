import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'AURA BI - AI Business Reports Ghana',
  description: 'Upload Excel, get AI insights in 60s. Business intelligence for small businesses in Accra, Ghana.',
  keywords: ['AI business', 'tech business', 'business intelligence Ghana', 'Accra'],
  metadataBase: new URL('https://aurabi1.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
