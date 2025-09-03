"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeleteTaskButton from "./DeleteTaskButton";
import { EditTaskForm } from "./EditTaskForm";
import QuickStatusUpdate from "./QuickStatusUpdate";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskListProps {
  refreshTrigger?: number;
  onTaskDeleted?: () => void;
}

export default function TaskList({ refreshTrigger, onTaskDeleted }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const { isLoaded, isSignedIn } = useAuth();

  const fetchTasks = async () => {
    try {
      console.log("🔍 [TaskList] Starting to fetch tasks");
      setLoading(true);
      const response = await fetch('/api/tasks');
      
      console.log("🔍 [TaskList] API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log("❌ [TaskList] API error response:", errorText);
        // throw new Error(`Failed to fetch tasks: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("✅ [TaskList] API response data:", result);
      
      // Handle both result.tasks and result.data formats
      const tasksData = result.tasks || result.data || [];
      console.log("📋 [TaskList] Setting tasks:", tasksData.length, "tasks");
      
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      console.error('❌ [TaskList] Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchTasks();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
      setTasks([]);
    }
  }, [isLoaded, isSignedIn, refreshTrigger]);

  // Refresh tasks when a task is deleted
  const handleTaskDeleted = () => {
    fetchTasks();
    // Call parent callback if provided
    if (onTaskDeleted) {
      onTaskDeleted();
    }
  };

  // Handle task updated
  const handleTaskUpdated = () => {
    setEditingTaskId(null); // Exit edit mode
    fetchTasks(); // Refresh the list
    // Call parent callback if provided
    if (onTaskDeleted) { // Using the same callback for now
      onTaskDeleted();
    }
  };

  // Handle edit button click
  const handleEditClick = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  if (!isLoaded || loading) {
    return (
      <div className="text-center py-8">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Please sign in to view your tasks.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error: {error}</p>
        <button 
          onClick={fetchTasks}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className="bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
        >
          <div className="p-5">
            {editingTaskId === task.id ? (
              // Edit mode
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">Edit Task</h4>
                </div>
                <EditTaskForm
                  task={task}
                  onTaskUpdated={handleTaskUpdated}
                  onCancel={handleCancelEdit}
                />
              </div>
            ) : (
              // View mode
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold  text-gray-900 leading-6">{task.title}</h3>
                  <div className="flex items-center space-x-2  border-gray-200 w-10 rounded-r-4xl">
                    {task.priority === 'HIGH' && <span className="text-xs font-medium text-red-500 uppercase tracking-wide">
                      {task.priority}
                    </span>}
                    {task.priority === 'MEDIUM' && <span className="text-xs font-medium text-yellow-500 uppercase tracking-wide">
                      {task.priority}
                    </span>}
                    {task.priority === 'LOW' && <span className="text-xs font-medium text-green-500 uppercase tracking-wide">
                      {task.priority}
                    </span>}
                    {/* <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {task.priority}
                    </span> */}
                  </div>
                </div>
                
                {task.description && (
                  <p className="text-gray-600 mb-3 leading-relaxed">{task.description}</p>
                )}
                
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  {task.dueDate && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(task.dueDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: task.dueDate.includes(new Date().getFullYear().toString()) ? undefined : 'numeric'
                      })}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status === 'COMPLETED' && '✅'}
                      {task.status === 'IN_PROGRESS' && '🔄'}
                      {task.status === 'PENDING' && '⏳'}
                      <span className="ml-1">
                        {task.status === 'IN_PROGRESS' ? 'In Progress' : 
                         task.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                      </span>
                    </span>
                  </div>
                </div>
                
                <QuickStatusUpdate 
                  taskId={task.id}
                  currentStatus={task.status}
                  onStatusUpdated={handleTaskUpdated}
                />
                
                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditClick(task.id)}
                    className="text-white w-16 h-8 hover:text-white hover:bg-blue-700 border-gray-300 bg-blue-600 transform hover:scale-105"
                  >
                    <svg className="w-1 h-3 mr-" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </Button>
                  <DeleteTaskButton taskId={task.id} onDeleted={handleTaskDeleted} />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}