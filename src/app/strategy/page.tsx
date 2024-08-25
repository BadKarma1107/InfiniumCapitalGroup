"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';

const FormPage: React.FC = () => {
  const todayDate = new Date();
  const [index, setSelectedOption] = useState<string>('NIFTY');
 
  const [numberInput1, setNumberInput1] = useState<string>('');
  const [numberInput2, setNumberInput2] = useState<string>('');
  const [day, setDay] = useState<string>(todayDate.getDate().toString());
  const [month, setMonth] = useState<string>((todayDate.getMonth() + 1).toString());
  const [year, setYear] = useState<string>(todayDate.getFullYear().toString());
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleNumberInput1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumberInput1(event.target.value);
  };

  const handleNumberInput2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumberInput2(event.target.value);
  };

  const handleDateChange = (type: 'day' | 'month' | 'year') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (type === 'day') setDay(value);
    if (type === 'month') setMonth(value);
    if (type === 'year') setYear(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isFormValid()) {
      const formData = {
        index,
        startStrike:numberInput1,
        endStrike:numberInput2,
        date:day,
            month,
        year
      };

      setLoading(true);
      setShowPopup(true);
      console.log('Form Data:', JSON.stringify(formData, null, 2));
      try {
        const response = await axios.post('https://nihar1107.pythonanywhere.com/submitAvailableStrikes', formData);
        setResponseMessage(`Success: ${response.data.status} (Status Code: ${response.status})`);
      } catch (error) {
        setResponseMessage(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    }
  };
  // const handleSubmit = (event: React.FormEvent) => {
  //   event.preventDefault();

  //   // Create a sample JSON object
  //   const sampleJson = {
  //     index:"NIFTY",
  //     startStrike:numberInput1 ,
  //     endStrike:numberInput2 ,
  //     date:day ,
  //     month,
  //     year
  //   };

  //   // Convert JSON object to a formatted string
  //   const formattedJson = JSON.stringify(sampleJson, null, 2);

  //   // Print formatted JSON in the popup
  //   setShowPopup(true);
  //   setResponseMessage(`Sample JSON: ${formattedJson}`);
  // };



  const formatDate = (): string => {
    return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
  };

  const isFormValid = (): boolean => {
    const num1 = numberInput1 !== '' ? Number(numberInput1) : NaN;
    const num2 = numberInput2 !== '' ? Number(numberInput2) : NaN;

    return (
      index !== ''
     
    );
  };

  return (
    <div className="flex my-10">
      {/* Left Sidebar */}
      <div className="w-1/5 p-4 ml-10 bg-gray-100">
        <h2 className="text-lg font-bold mb-4">Strategies</h2>
        <ul className="space-y-2">
          {["Selling",].map((num) => (
            <li key={num} className="p-2 bg-white shadow rounded">
              <Link 
                href={`/strategy/${1}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <p className="block text-gray-700 hover:text-gray-900">
                  {num}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Form Container */}
      <div className="w-4/5 p-4">
        <h2 className="text-lg font-bold mb-4">Form</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700 mb-1">
              Select Option
            </label>
            <select
              id="dropdown"
              value={index}
              onChange={handleDropdownChange}
              className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY", "SENSEX"].map((num) => (
                <option key={num} value={num}>
                   {num}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="number1" className="block text-sm font-medium text-gray-700 mb-1">
              Start Strike
            </label>
            <input
              type="text"
              id="number1"
              value={numberInput1}
              onChange={handleNumberInput1Change}
              className={`block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${numberInput1 !== '' && Number(numberInput1) % 100 !== 0 ? 'border-red-500' : ''}`}
              placeholder="Enter number"
              required
            />
            {numberInput1 !== '' && Number(numberInput1) % 100 !== 0 && (
              <p className="text-red-500 text-sm">Number must be divisible by 100.</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="number2" className="block text-sm font-medium text-gray-700 mb-1">
              End Strike
            </label>
            <input
              type="text"
              id="number2"
              value={numberInput2}
              onChange={handleNumberInput2Change}
              className={`block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${numberInput2 !== '' && Number(numberInput2) % 100 !== 0 ? 'border-red-500' : ''}`}
              placeholder="Enter number"
              required
            />
            {numberInput2 !== '' && Number(numberInput2) % 100 !== 0 && (
              <p className="text-red-500 text-sm">Number must be divisible by 100.</p>
            )}
          </div>

          {/* Date Selection Component */}
          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="grid gap-4 grid-cols-3">
              <input
                type="number"
                id="day"
                value={day}
                onChange={handleDateChange('day')}
                min="1"
                max="31"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="number"
                id="month"
                value={month}
                onChange={handleDateChange('month')}
                min="1"
                max="12"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="number"
                id="year"
                value={year}
                onChange={handleDateChange('year')}
                min="1900"
                max="2100"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
              <p className="text-lg font-semibold text-gray-700">
                Selected Date: {formatDate()}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full p-2 rounded-lg ${isFormValid() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={!isFormValid()}
          >
            Submit
          </button>
        </form>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Form Data</h3>
            {loading ? (
              <p className="text-blue-500">Submitting...</p>
            ) : (
              <pre>{responseMessage}</pre>
            )}
            <button
              onClick={() => {
                setShowPopup(false);
                // Reset form fields
                setSelectedOption('1');
                setNumberInput1('');
                setNumberInput2('');
                setDay(todayDate.getDate().toString());
                setMonth((todayDate.getMonth() + 1).toString());
                setYear(todayDate.getFullYear().toString());
              }}
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPage;

// https://nihar1107.pythonanywhere.com/SubmitBtnStrategy${params.id}
