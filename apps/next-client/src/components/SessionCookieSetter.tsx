'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setSessionCookies } from '@/utils/sessionCookies';

const SessionCookieSetter = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setSessionCookies(session.user);
    }
  }, [status, session]);

  return null;
};

export default SessionCookieSetter;