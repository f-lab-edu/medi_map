'use client';

import { usePathname } from 'next/navigation';

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const getClass = (pathname: string): string => {
    if (pathname === '/') return 'home';
    return pathname.slice(1).toLowerCase().replace(/\//g, '_');
  };
  
  const className = getClass(pathname);
  
  return (
    <div className={className}>
      <div className="inner">{children}</div>
    </div>
  );
}
