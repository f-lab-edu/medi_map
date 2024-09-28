'use client';
import '@/styles/common/common.scss';
import Header from '@/components/header';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const className =
    pathname === '/' ? 'home' : `${pathname.slice(1).toLowerCase()}`.replace(/\//g, '-');

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header />
          <div className={className}>
            <div className="inner">{children}</div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}