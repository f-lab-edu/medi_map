import { useState } from 'react';

export const useSignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
  };
};
