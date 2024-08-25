"use client"
import React, { useEffect, useState } from 'react';

const FetchComponent: React.FC = () => {
  const [responseText, setResponseText] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const testRequest = async () => {
      try {
        const response = await fetch('https://nihar1107.pythonanywhere.com/iterationStrategy1');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text(); // Get response as text for initial debugging
        setResponseText(text);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unknown error occurred'));
        }
      } finally {
        setLoading(false);
      }
    };

    testRequest();
  }, []);

  return (
    <div>
      <h1>Fetch Component</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {!loading && !error && <pre>{responseText}</pre>}
    </div>
  );
};

export default FetchComponent;
