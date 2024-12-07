import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

function SummaryList({ summaries, onSelect, onDelete, selectedSummaryId }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg h-full overflow-y-auto transition-transform duration-300">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-600">Past Summaries</h2>
      {summaries.length === 0 ? (
        <p className="text-gray-500 italic text-center">No summaries available.</p>
      ) : (
        <ul className="space-y-4">
          {summaries.map((summary) => (
            <li
              key={summary._id}
              className={`p-4 rounded-lg flex justify-between items-center transition-transform duration-200 cursor-pointer ${
                selectedSummaryId === summary._id
                  ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => onSelect(summary)}
            >
              <div className="flex-grow">
                <p
                  className={`font-medium ${
                    selectedSummaryId === summary._id ? 'text-blue-600' : 'text-gray-800'
                  }`}
                >
                  {summary.summaryName}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(summary.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  onDelete(summary._id);
                }}
                className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
              >
                <FiTrash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SummaryList;




