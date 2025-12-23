import { useState, useEffect } from 'react';

export const useApiKey = () => {
  const [key, setKey] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("apiKey");
    if (stored) setKey(stored);
  }, []);

  const update = (v: string) => {
    localStorage.setItem("apiKey", v);
    setKey(v);
  };

  return { key, update };
};
