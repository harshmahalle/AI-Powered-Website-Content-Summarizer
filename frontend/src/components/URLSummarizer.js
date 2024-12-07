import React, { useState } from 'react';
import axios from 'axios';

function URLSummarizer({ onSummarySuccess }) {
  const [url, setUrl] = useState('');
  const [summaryName, setSummaryName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setMessage('');
  };

  const handleSummaryNameChange = (e) => {
    setSummaryName(e.target.value);
    setMessage('');
  };

  const handleSummarize = async () => {
    if (!url || !summaryName) {
      setMessage('Please enter a valid URL and summary name.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Processing the URL...');
      
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/summary/url`, 
        { url, summaryName }, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("API Response for URL summary from backend", response);
      setMessage('URL processed and summarized successfully!');
      setUrl('');
      setSummaryName('');
      onSummarySuccess(response.data.data);
    } catch (error) {
      console.error('Error processing URL:', error);
      setMessage('The content is too large to process. Please try a different URL.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md transition-transform duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-blue-500">Summarize Website Content</h2>
      <input
        type="text"
        placeholder="Enter Website URL"
        value={url}
        onChange={handleUrlChange}
        className="mb-4 w-full border-2 border-blue-300 rounded p-2 hover:border-blue-500"
      />
      <input
        type="text"
        placeholder="Enter Summary Name"
        value={summaryName}
        onChange={handleSummaryNameChange}
        className="mb-4 w-full border-2 border-blue-300 rounded p-2 hover:border-blue-500"
      />
      <button
        onClick={handleSummarize}
        disabled={processing}
        className={`w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {processing ? 'Processing...' : 'Summarize'}
      </button>
      {message && <p className="mt-2 text-center text-gray-700">{message}</p>}
    </div>
  );
}

export default URLSummarizer;



