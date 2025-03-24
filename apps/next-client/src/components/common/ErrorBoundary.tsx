'use client';

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function Fallback({ error }: { error: Error }) {
  console.error("Uncaught error:", error);
  return <p>오류가 발생했습니다. 나중에 다시 시도해주세요.</p>;
}

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={Fallback}>
      {children}
    </ReactErrorBoundary>
  );
}