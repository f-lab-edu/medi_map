import '@/styles/common/common.scss';
import Header from '@/components/Header';
import ContentWrapper from '@/components/ContentWrapper';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <ContentWrapper>{children}</ContentWrapper>
      </body>
    </html>
  );
}