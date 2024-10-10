'use client';

import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/urls';

const getClassNameFromPath = (pathname: string): string => {
  if (pathname === ROUTES.HOME) return 'home';

  return pathname
    .slice(1)
    .toLowerCase()
    .replace(/\//g, '_');
};

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const className = getClassNameFromPath(pathname);

  return (
    <div className={className}>
      <div className="inner">{children}</div>
    </div>
  );
}
