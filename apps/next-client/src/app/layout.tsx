'use client';
import '@/assets/styles/global.css';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const className =
    pathname === '/' ? 'home' : `${pathname.slice(1).toLowerCase()}`.replace(/\//g, '-');

  return (
    <html lang="en">
      <body>
        <div className={className}>{children}</div>
      </body>
    </html>
  );
}