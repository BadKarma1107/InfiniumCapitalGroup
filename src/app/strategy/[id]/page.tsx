"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
const IndexPage = ({ params }: { params: { id: string } }) => {

  const [responseData, setResponseData] = useState(null); // State to store response data
  const abortControllerRef = useRef<AbortController | null>(null);
  const todayDate = new Date();
  const [index, setIndex] = useState<string>("NIFTY");
  const [account, setAccount] = useState<number>(1);
  const [ltp, setLtp] = useState<number>(1);
  const [resettarget, setResettarget] = useState<number | undefined>(undefined);
  const [cestrike, setCestrike] = useState<number | undefined>(undefined);
  const [pestrike, setPestrike] = useState<number | undefined>(undefined);
  const [petarget, setPetarget] = useState<number | undefined>(undefined);
  const [cetarget, setCetarget] = useState<number | undefined>(undefined);
  const [pnltarget, setPnltarget] = useState<number | undefined>(undefined);
  const [stopLoss, setStopLoss] = useState<number | undefined>(undefined);
  const [lotSize, setLotSize] = useState<number | undefined>(undefined);
  const [formData, setFormData] = useState<any>(null); // To store form data for display
  const [day, setDay] = useState<number>(todayDate.getDate());
  const [month, setMonth] = useState<number>(todayDate.getMonth() + 1); // Months are 0-indexed
  const [year, setYear] = useState<number>(todayDate.getFullYear());
  const [isExited, setIsExited] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // New state for processing
  const [apiCallSuccess, setApiCallSuccess] = useState<boolean>(false); // New state for API success

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Validation logic: Check if all fields have values
    const allFieldsFilled =
      index !== undefined &&
      resettarget !== undefined &&
      day > 0 &&
      month > 0 &&
      year > 0 &&
      cestrike !== undefined &&
      pestrike !== undefined &&
      petarget !== undefined &&
      pnltarget !== undefined &&
      cetarget !== undefined &&
      stopLoss !== undefined &&
      lotSize !== undefined;

    setIsFormValid(allFieldsFilled);
  }, [index, account, ltp, resettarget, day, month, year, cestrike, pestrike, cetarget, petarget, pnltarget, stopLoss, lotSize]);

  const handleDateChange = (type: 'day' | 'month' | 'year') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (type === 'day') setDay(value);
    if (type === 'month') setMonth(value);
    if (type === 'year') setYear(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      index,
      account: account.toString(),
      ltp: ltp.toString(),
      resettarget: resettarget !== undefined ? resettarget.toString() : '',
      day: day.toString(),
      month: month.toString(),
      year: year.toString(),
      cestrike: cestrike !== undefined ? cestrike.toString() : '',
      pestrike: pestrike !== undefined ? pestrike.toString() : '',
      cetarget: cetarget !== undefined ? cetarget.toString() : '',
      petarget: petarget !== undefined ? petarget.toString() : '',
      pnltarget: pnltarget !== undefined ? pnltarget.toString() : '',
      stopLoss: stopLoss !== undefined ? stopLoss.toString() : '',
      lotSize: lotSize !== undefined ? lotSize.toString() : '',
    };

    try {
      const response = await fetch('https://nihar1107.pythonanywhere.com/SubmitBtnStrategy1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(data),
        credentials: 'include', // This is crucial for sending and receiving cookies
      });



      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      alert(`Response received: ${JSON.stringify(responseData.status)}`);
      if (responseData.status === "success") {
        setFormData(data); // Store the submitted form data for display
        setApiCallSuccess(true); // Set API call success to true
      }
    } catch (error) {
      console.error('There was an error submitting the form:', error);
      alert('An error occurred while submitting the form. Please try again.');
      setApiCallSuccess(false); // Set API call success to false
    }
  };





  const api = axios.create({
    baseURL: 'https://nihar1107.pythonanywhere.com',
    withCredentials: true,
  });

  const handleStart = async () => {
    setIsProcessing(true);
    setIsExited(true);
    // If there's an ongoing process, abort it
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for this process
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let shouldContinue = true;

    const runIteration = async () => {
      try {
        console.log('Sending request to /iterationStrategy1');
        const response = await api.get('/iterationStrategy1', {
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortController.signal, // Attach the signal to the request
        });
        console.log('Response received:', response.data);

        // Update the state with the response data
        setResponseData(response.data);

        if (response.data.status === 'ok' || response.data.status === 'success') {
          console.log('Status is ok. Proceeding to the next turn.');
          return true;
        } else {
          console.log('Status is not ok. Stopping the process.');
          return false;
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') {
          // Handle the case where the request was aborted
          console.log('Request was canceled.');
          return false;
        }

        console.error('Error in iteration:', error);
        if (axios.isAxiosError(error)) {
          console.error('Response data:', error.response?.data);
          console.error('Response status:', error.response?.status);
        }
        return false;
      }
    };

    // Process iterations sequentially
    const processIterations = async () => {
      while (shouldContinue) {
        shouldContinue = await runIteration();
        if (shouldContinue) {
          await new Promise((resolve) => setTimeout(resolve, 1));
        }
      }
      setIsProcessing(false);
    };

    processIterations();
  };




  // const api = axios.create({
  //   baseURL: 'https://nihar1107.pythonanywhere.com',
  //   withCredentials: true,
  // });
  // const abortControllerRef = useRef<AbortController | null>(null);

  // const handleStart = async () => {
  //   setIsProcessing(true);

  //   // If there's an ongoing process, abort it
  //   if (abortControllerRef.current) {
  //     abortControllerRef.current.abort();
  //   }

  //   // Create a new AbortController for this process
  //   const abortController = new AbortController();
  //   abortControllerRef.current = abortController;

  //   let shouldContinue = true;

  //   const runIteration = async () => {
  //     try {
  //       console.log('Sending request to /iterationStrategy1');
  //       const response = await api.get('/iterationStrategy1', {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         signal: abortController.signal, // Attach the signal to the request
  //       });
  //       console.log('Response received:', response.data);

  //       if (response.data.status === 'ok' || response.data.status === 'success') {
  //         console.log('Status is ok. Proceeding to the next turn.');
  //         return true;
  //       } else {
  //         console.log('Status is not ok. Stopping the process.');
  //         return false;
  //       }
  //     } catch (error) {
  //       if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') {
  //         // Handle the case where the request was aborted
  //         console.log('Request was canceled.');
  //         return false;
  //       }

  //       console.error('Error in iteration:', error);
  //       if (axios.isAxiosError(error)) {
  //         console.error('Response data:', error.response?.data);
  //         console.error('Response status:', error.response?.status);
  //       }
  //       return false;
  //     }
  //   };

  //   // Process iterations sequentially
  //   const processIterations = async () => {
  //     while (shouldContinue) {
  //       shouldContinue = await runIteration();
  //       if (shouldContinue) {
  //         await new Promise((resolve) => setTimeout(resolve, 1)); 
  //       }
  //     }
  //     setIsProcessing(false);
  //   };

  //   processIterations();
  // };

  const handleStop = () => {
    // Abort the ongoing process
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsProcessing(false); // Ensure processing state is updated
  };

  const handleExit = async () => {
    // Abort the ongoing process
    setIsExited(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Set the processing state to false
    setIsProcessing(false);

    // Call the API to stop the server-side process
    try {
      console.log('Sending request to stop server-side process');
      await api.get('/exitStrategy1', {
        headers: {
          'Content-Type': 'application/json',
        },

      });

      console.log('Server-side process stopped successfully');
    } catch (error) {
      console.error('Error stopping server-side process:', error);
    }
  };




  const formatDate = (): string => {
    return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Index Dropdown */}
        <div className="mb-6">
          <label htmlFor="index" className="block text-sm font-medium text-gray-700">
            Index
          </label>
          <select
            id="index"
            value={index}
            onChange={(e) => setIndex(String(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY", "SENSEX"].map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {/* Account Dropdown */}
        <div className="mb-6">
          <label htmlFor="account" className="block text-sm font-medium text-gray-700">
            Account
          </label>
          <select
            id="account"
            value={account}
            onChange={(e) => setAccount(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {[1, 2, 3, 4].map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {/* LTP Dropdown */}
        <div className="mb-6">
          <label htmlFor="ltp" className="block text-sm font-medium text-gray-700">
            LTP
          </label>
          <select
            id="ltp"
            value={ltp}
            onChange={(e) => setLtp(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {[1, 2, 3, 4].map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Target */}
        <div className="mb-6">
          <label htmlFor="resettarget" className="block text-sm font-medium text-gray-700">
            Reset Target
          </label>
          <input
            id="resettarget"
            type="number"
            value={resettarget || ''}
            onChange={(e) => setResettarget(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700">
                Day
              </label>
              <input
                id="day"
                type="number"
                value={day}
                onChange={handleDateChange('day')}
                min="1"
                max="31"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                Month
              </label>
              <input
                id="month"
                type="number"
                value={month}
                onChange={handleDateChange('month')}
                min="1"
                max="12"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                id="year"
                type="number"
                value={year}
                onChange={handleDateChange('year')}
                min="2000"
                max="2100"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
            <p className="text-lg font-semibold text-gray-700">
              Selected Date: {formatDate()}
            </p>
          </div>
        </div>

        {/* U-Strick and P-Strick */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="cestrike" className="block text-sm font-medium text-gray-700">
              CE-Strike
            </label>
            <input
              id="cestrike"
              type="number"
              value={cestrike || ''}
              onChange={(e) => setCestrike(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="pestrike" className="block text-sm font-medium text-gray-700">
              PE-Strike
            </label>
            <input
              id="pestrike"
              type="number"
              value={pestrike || ''}
              onChange={(e) => setPestrike(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Targets, Stoploss, Lot Size */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div>
            <label htmlFor="cetarget" className="block text-sm font-medium text-gray-700">
              CE-Target
            </label>
            <input
              id="cetarget"
              type="number"
              value={cetarget || ''}
              onChange={(e) => setCetarget(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="petarget" className="block text-sm font-medium text-gray-700">
              PE-Target
            </label>
            <input
              id="petarget"
              type="number"
              value={petarget || ''}
              onChange={(e) => setPetarget(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="pnltarget" className="block text-sm font-medium text-gray-700">
              PNL-Target
            </label>
            <input
              id="pnltarget"
              type="number"
              value={pnltarget || ''}
              onChange={(e) => setPnltarget(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="stopLoss" className="block text-sm font-medium text-gray-700">
              Stoploss
            </label>
            <input
              id="stopLoss"
              type="number"
              value={stopLoss || ''}
              onChange={(e) => setStopLoss(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="lotSize" className="block text-sm font-medium text-gray-700">
              Lot Size
            </label>
            <input
              id="lotSize"
              type="number"
              value={lotSize || ''}
              onChange={(e) => setLotSize(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid} // Disable button if form is not valid
          className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm ${isFormValid ? 'text-white bg-indigo-600 hover:bg-indigo-700' : 'text-gray-400 bg-gray-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          Submit
        </button>

        {/* Start and Stop Buttons */}
        {apiCallSuccess && (
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={handleStart}
              disabled={isProcessing}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm ${isProcessing ? 'text-gray-400 bg-gray-300 cursor-not-allowed' : 'text-white bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              Start
            </button>
            <button
              type="button"
              onClick={handleStop}
              disabled={!isProcessing}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm ${!isProcessing ? 'text-gray-400 bg-gray-300 cursor-not-allowed' : 'text-white bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              Stop
            </button>
            <button
              type="button"
              onClick={handleExit}
              disabled={!isExited}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm ${!isExited ? 'text-gray-400 bg-gray-300 cursor-not-allowed' : 'text-white bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              Exit
            </button>
          </div>
        )}
      </form>

      {/* Display Form Data */}
      <div className='container max-w-xl mr-auto p-4'>
    <h3 className='text-xl font-semibold mb-4'>Response Data:</h3>
    {responseData && (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {Object.entries(responseData).map(([key, value]) => {
          // Skip rendering if the key is "status"
          if (key === 'status') {
            return null;
          }

          // Determine the container color based on pnl
          // Define the type for the expected structure of responseData
interface ResponseData {
  pnl?: number; // pnl is optional and might not be present
}

// Simulating a responseData object (you can replace this with actual data)
const responseData: ResponseData = {
  // pnl: 10 // Uncomment this line for testing
};

// Initialize pnlValue with a default value
let pnlValue: number;

// Handle potential errors and ensure pnlValue is a number
try {
  if (responseData && typeof responseData.pnl === 'number') {
      pnlValue = responseData.pnl;
  } else {
      throw new Error("Invalid pnl value");
  }
} catch (error) {
  // Set pnlValue to 0 if there's an error
  pnlValue = 0;
}

// Determine the container class based on pnlValue
const containerClass = pnlValue >= 0 ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300';

console.log(containerClass); // Output the class for debugging

          
          return (
            <div key={key} className={`flex flex-col items-start border p-4 rounded-lg shadow-sm ${containerClass}`}>
              <div className='flex-shrink-0 w-full'>
                <h3 className='font-bold'>{key.replace(/_/g, ' ').toUpperCase()}</h3>
              </div>
              <div className='mt-2 w-full'>
                <p className='whitespace-pre-wrap'>{JSON.stringify(value, null, 2)}</p>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
      {formData && (
        <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold">Submitted Data</h2>

          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
