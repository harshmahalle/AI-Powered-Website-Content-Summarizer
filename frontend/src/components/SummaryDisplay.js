import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { FiEdit, FiSave, FiShare2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFileDownload } from "react-icons/fa";

function SummaryDisplay({ summary, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(summary.summary);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const MAX_WORD_LIMIT = 50;

  const truncateText = (text, limit) => {
    const words = text.split(' ');
    return words.length > limit ? words.slice(0, limit).join(' ') + '...' : text;
  };

  const toggleContentView = () => setShowFullContent(!showFullContent);
  const toggleSummaryView = () => setShowFullSummary(!showFullSummary);

  const downloadSummaryPDF = () => {
    const doc = new jsPDF();
    const primaryColor = '#007BFF';
    const margin = 20;

    doc.setFontSize(24);
    doc.setTextColor(primaryColor);
    doc.text('URL Summary Report', margin, 30);

    let currentY = 45;

    const addText = (text, fontSize = 12, color = '#000') => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color);
      const lines = doc.splitTextToSize(text, 170);
      lines.forEach((line, index) => {
        if (currentY + 10 > doc.internal.pageSize.height - margin) {
          doc.addPage();
          currentY = margin;
        }
        doc.text(line, margin, currentY);
        currentY += 10;
      });
    };

    addText(`URL: ${summary.url || 'No URL available.'}`, 14, primaryColor);
    currentY += 10;
    addText(`Website Content: ${summary.websiteContent || 'No content available.'}`, 12);
    currentY += 10;
    addText(`Summary: ${summary.summary || 'No summary available.'}`, 12);

    doc.save('URL_Summary.pdf');
  };

  const shareSummary = (platform) => {
    const text = `Check out this summary:\n\nURL: ${summary.url || 'No URL'}\n\nSummary: ${summary.summary || 'No summary available.'}`;
    const encodedText = encodeURIComponent(text);
  
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(summary.url)}&text=${encodedText}`, '_blank');
    } else if (platform === 'reddit') {
      window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(summary.url)}&title=${encodeURIComponent("Check out this summary!")}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(summary.url)}`, '_blank');
    }
    setIsShareModalOpen(false);
  };
  
  useEffect(() => {
    setEditedSummary(summary.summary);
  }, [summary.summary]);

  const handleEditClick = () => {
    if (isEditing) updateSummary();
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => setEditedSummary(e.target.value);

  const updateSummary = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/summary/${summary._id}`,
        { summary: editedSummary }
      );
      toast.success('Summary updated successfully!');
      onUpdate(response.data.data);
      setIsEditing(false);
    } catch (error) {
      toast.error('Error updating summary: ' + error.message);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg h-full overflow-y-auto flex flex-col space-y-6">
      <h2 className="text-3xl font-extrabold text-blue-600">Summary Details</h2>

      {/* URL Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">URL:</h3>
        <p className="text-blue-600 underline break-all">{summary.url}</p>
      </div>

      {/* Website Content Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Website Content:</h3>
        <p className="text-gray-700 whitespace-pre-wrap">
          {showFullContent ? summary.websiteContent : truncateText(summary.websiteContent, MAX_WORD_LIMIT)}
        </p>
        {summary.websiteContent.split(' ').length > MAX_WORD_LIMIT && (
          <button
            onClick={toggleContentView}
            className="mt-2 text-blue-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {showFullContent ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>

      {/* Summary Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Summary:</h3>
        {isEditing ? (
          <textarea
            value={editedSummary}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">
            {showFullSummary ? summary.summary : truncateText(summary.summary, MAX_WORD_LIMIT)}
          </p>
        )}
        {!isEditing && summary.summary.split(' ').length > MAX_WORD_LIMIT && (
          <button
            onClick={toggleSummaryView}
            className="mt-2 text-blue-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {showFullSummary ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>

      {/* Actions Section */}
      <div className="mt-auto flex flex-col sm:flex-row sm:justify-end gap-4">
        <button
          onClick={handleEditClick}
          className={`flex items-center justify-center px-5 py-3 rounded-lg text-white font-semibold shadow-lg transform transition-transform ${
            isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isEditing ? (
            <>
              <FiSave className="mr-2" /> Save
            </>
          ) : (
            <>
              <FiEdit className="mr-2" /> Edit
            </>
          )}
        </button>

        <button
          onClick={downloadSummaryPDF}
          className="flex items-center justify-center px-5 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold shadow-lg transform transition-transform"
        >
          <FaFileDownload className="mr-2" /> Download
        </button>

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center justify-center px-5 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transform transition-transform mr-14"
        >
          <FiShare2 className="mr-2" /> Share
        </button>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold">Share Summary</h3>
            <button
              onClick={() => shareSummary('whatsapp')}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
            >
              WhatsApp
            </button>
            <button
              onClick={() => shareSummary('telegram')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
            >
              Telegram
            </button>
            <button
              onClick={() => shareSummary('reddit')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
            >
              Reddit
            </button>
            <button
              onClick={() => shareSummary('linkedin')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              LinkedIn
            </button>
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default SummaryDisplay;
