"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteTaskButtonProps {
  taskId: string;
  onDeleted?: () => void;
}

export default function DeleteTaskButton({ taskId, onDeleted }: DeleteTaskButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      
      // Call the callback to refresh the task list
      if (onDeleted) {
        onDeleted();
      } else {
        // Fallback to router refresh if no callback provided
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="
        inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium rounded-md
        text-white bg-red-500 hover:bg-red-500 h-8
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 transform hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        shadow-sm hover:shadow-md
      "
      title={isDeleting ? "Deleting..." : "Delete Task"}
    >
      {isDeleting ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  );
}
