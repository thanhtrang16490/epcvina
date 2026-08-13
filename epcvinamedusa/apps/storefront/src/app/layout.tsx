import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EPCVINA Solar',
  description: 'Next.js storefront kết nối Medusa',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
