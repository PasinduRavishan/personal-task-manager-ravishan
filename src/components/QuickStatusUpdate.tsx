"use client";

import { useState } from "react";

interface QuickStatusUpdateProps {
  taskId: string;
  currentStatus: string;
  onStatusUpdated?: () => void;
}

export default function QuickStatusUpdate({ taskId, currentStatus, onStatusUpdated }: QuickStatusUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (newStatus: string) => {
    if (newStatus === currentStatus) return; 
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      if (onStatusUpdated) {
        onStatusUpdated();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update task status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusButton = (status: string, label: string, emoji: string) => (
    <button
      key={status}
      onClick={() => updateStatus(status)}
      disabled={isUpdating || currentStatus === status}
      className={`
        inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 transform
        ${currentStatus === status 
          ? 'bg-blue-600 text-white shadow-lg border scale-102 border-white' 
          : 'bg-white text-gray-700 border border-grey-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:scale-105 shadow-sm'
        }
        ${isUpdating ? 'opacity-50 cursor-not-allowed animate-pulse' : 'cursor-pointer'}
        focus:outline-none focus:ring-4 focus:ring-blue-200
      `}
    >
      <span className="mr-2 text-base">{emoji}</span>
      <span className="font-medium">{label}</span>
      {currentStatus === status && (
        <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        {/* <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg> */}
        {/* <span className="text-sm font-semibold text-gray-700">Quick Status Update</span> */}
      </div>
      <div className="flex flex-wrap gap-2">
        {getStatusButton("PENDING", "Pending", "⏳")}
        {getStatusButton("IN_PROGRESS", "In Progress", "🔄")}
        {getStatusButton("COMPLETED", "Completed", "✅")}
      </div>
      {isUpdating && (
        <div className="flex items-center text-sm text-blue-600">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Updating status...
        </div>
      )}
    </div>
  );
}
