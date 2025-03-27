import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/common/common.scss';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth/authOptions';
import Header from '@/components/Header';
import SessionWrapper from '@/components/SessionWrapper';
import ContentWrapper from '@/components/ContentWrapper';
import { ReactNode } from 'react';
import SessionCookieSetter from '@/components/SessionCookieSetter';
import Script from 'next/script';
import Providers from '@/app/provider';

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          async
          defer
        />
        <Providers>
          <SessionWrapper session={session}>
            <Header />
            <ContentWrapper>
              {children}
              <SessionCookieSetter />
            </ContentWrapper>
          </SessionWrapper>
        </Providers>
      </body>
    </html>
  );
}
