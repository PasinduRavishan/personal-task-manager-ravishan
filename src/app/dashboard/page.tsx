"use client";

import {TaskForm} from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import TaskFilter from "../../components/TaskFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userSynced, setUserSynced] = useState(false);
  const [filters, setFilters] = useState<{ status?: string; priority?: string }>({});
  const { isLoaded, isSignedIn } = useAuth();

  // Sync user on load
  useEffect(() => {
    // console.log("[Dashboard] Starting user sync and task fetch");
    const syncUser = async () => {
      try {
        // console.log("[Dashboard] Calling sync-user API");
        const syncResponse = await fetch('/api/sync-user', { method: 'POST' });
        const syncResult = await syncResponse.json();
        // console.log("Dashboard] Sync result:", syncResult);
        
        if (syncResponse.ok) {
          // console.log("[Dashboard] User sync successful, triggering task refresh");
          // Trigger TaskList refresh
          setRefreshTrigger(prev => prev + 1);
        } else {
          console.error("[Dashboard] Sync failed:", syncResult);
        }
      } catch (error) {
        console.error("[Dashboard] Sync error:", error);
      }
    };

    syncUser();
  }, []);

  const handleTaskCreated = () => {
    // Trigger task list refresh
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTaskDeleted = () => {
    // Trigger task list refresh
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFilterChange = (newFilters: { status?: string; priority?: string }) => {
    setFilters(newFilters);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('/bg1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div> */}
      {/* Navigation */}
      <Navbar showAuthButtons={false} />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm pt-20">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
          {/* <div className="flex items-center justify-between py-4"> */}
            {/* Left: Logo and Brand */}
            {/* <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Scheduly</h1>
                <p className="text-sm text-gray-500">Organize your tasks efficiently</p>
              </div>
            </div> */}
            
            {/* Right: User Profile */}
            {/* <div className="flex items-center space-x-4">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                    userButtonPopoverCard: "shadow-lg",
                  }
                }}
              />
            </div> */}
          {/* </div> */}
        {/* </div> */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Create Task (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Create New Task</h2>
              </div>
              <TaskForm onTaskCreated={handleTaskCreated} />
            </div>
          </div>

          {/* Right Column - Task List (Main Content) */}
          <div className="lg:col-span-2">
            {/* Filter Component */}
            <TaskFilter onFilterChange={handleFilterChange} activeFilters={filters} />
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
                </div>
              </div>
              <div className="p-6">
                <TaskList refreshTrigger={refreshTrigger} onTaskDeleted={handleTaskDeleted} filters={filters} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}