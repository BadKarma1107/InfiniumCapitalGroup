"use client";
import { useState } from 'react';

const Form = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('https://flasktesting007.pythonanywhere.com/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY as string,
        },
        body: JSON.stringify({
          name,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      setResult('Error occurred');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Check Name in Message</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
      {result && (
        <h2 className="mt-4 text-lg font-semibold">Result: {result}</h2>
      )}
    </div>
  );
};

export default Form;
