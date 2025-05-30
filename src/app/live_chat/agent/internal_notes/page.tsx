// src/agent/internal-notes/InternalNotes.tsx

'use client';

import React, { useState } from 'react';

const InternalNotes = () => {
  const [internalNotes, setInternalNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState<string>('');

  const handleAddInternalNote = () => {
    if (newNote.trim()) {
      setInternalNotes([...internalNotes, `Agent Note: ${newNote}`]);
      setNewNote('');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Internal Notes</h2>
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Notes History</h3>
          <div className="space-y-2">
            {internalNotes.map((note, idx) => (
              <div key={idx} className="text-gray-700">
                {note}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Add internal note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
          <button
            onClick={handleAddInternalNote}
            className="bg-green-500 text-white p-2 rounded"
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternalNotes;
