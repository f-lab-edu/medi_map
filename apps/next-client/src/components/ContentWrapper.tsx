'use client';

import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/urls';

const getPageClass = (pathname: string): string => {
  if (pathname === ROUTES.HOME) return 'home';
  
  const paths = pathname.split('/').filter(Boolean); 
  const className = paths.join('_').toLowerCase();
  
  return className;
};

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const className = getPageClass(pathname);

  return (
    <div className={className}>
      <div className="inner">{children}</div>
    </div>
  );
}