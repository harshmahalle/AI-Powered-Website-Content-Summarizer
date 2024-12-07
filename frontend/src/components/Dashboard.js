import React, { useState, useEffect } from 'react';
import URLSummarizer from './URLSummarizer';
import SummaryList from './SummaryList';
import SummaryDisplay from './SummaryDisplay';
import axios from 'axios';

function Dashboard() {
  const [summaries, setSummaries] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/summary`);
      setSummaries(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching summaries:', error);
      setIsLoading(false);
    }
  };

  const handleSummarySuccess = (newSummary) => {
    setSummaries(prevSummaries => [newSummary, ...prevSummaries]);
    setSelectedSummary(newSummary); 
  };

  // Function to delete a summary
  const handleDeleteSummary = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/summary/${id}`);
      setSummaries(summaries.filter(summary => summary._id !== id));
      if (selectedSummary && selectedSummary._id === id) {
        setSelectedSummary(null);
      }
    } catch (error) {
      console.error('Error deleting summary:', error);
    }
  };

  // Handle summary updates
  const handleUpdateSummary = (updatedSummary) => {
    setSummaries(prevSummaries =>
      prevSummaries.map(summary =>
        summary._id === updatedSummary._id ? updatedSummary : summary
      )
    );

    if (selectedSummary && selectedSummary._id === updatedSummary._id) {
      setSelectedSummary(updatedSummary);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6 flex flex-col items-center">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4 hover:scale-105 transition-transform duration-300">
          AI-Powered URL Summarizer
        </h1>
        <p className="text-lg text-gray-700">
          Paste a website URL and get instant summaries!
        </p>
      </header>

      {/* URL Summarizer Section */}
      <div className="w-full max-w-lg p-6 mb-12 bg-white rounded-lg shadow-md text-center">
        <URLSummarizer onSummarySuccess={handleSummarySuccess} />
      </div>

      {/* Main Content */}
      <div className="w-full flex flex-wrap justify-center gap-8">
        {/* Summary List */}
        <div className="w-full md:w-2/5 bg-white p-6 rounded-lg shadow-md">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading summaries...</div>
          ) : (
            <SummaryList summaries={summaries} onSelect={setSelectedSummary} onDelete={handleDeleteSummary} />
          )}
        </div>

        {/* Summary Display */}
        <div className="w-full md:w-2/5 bg-white p-6 rounded-lg shadow-md">
          {selectedSummary ? (
            <SummaryDisplay summary={selectedSummary} onUpdate={handleUpdateSummary} />
          ) : (
            <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
              Select a summary to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
