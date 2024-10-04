import '@/styles/common/common.scss';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Header from '@/components/Header';
import SessionWrapper from '@/components/SessionWrapper';
import ContentWrapper from '@/components/ContentWrapper';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <SessionWrapper session={session}>
          <Header session={session} />
          <ContentWrapper>
            {children}
          </ContentWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
