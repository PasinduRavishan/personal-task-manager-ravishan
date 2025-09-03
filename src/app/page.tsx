"use client"
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  if (isLoaded && isSignedIn) {
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `url('/bg1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/70 to-gray-50/80"></div>
      
      
      <Navbar showAuthButtons={true} />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Hero Content */}
          <div className="mb-8 backdrop-blur-sm bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-lg">
              Stay
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 drop-shadow-sm">
                {" "}Organized
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
              Transform your productivity with Scheduly - the elegant task management solution that keeps you focused and organized.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center items-center mb-12 relative z-10">
            <SignUpButton 
              mode="redirect" 
              forceRedirectUrl="/dashboard"
              signInForceRedirectUrl="/dashboard"
            >
              <button className="relative z-20 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 cursor-pointer">
                <span>Create Account</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </SignUpButton>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center p-6 rounded-xl bg-white/80 backdrop-blur-md shadow-xl border border-white/30">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cross-Device Sync</h3>
              <p className="text-gray-700 text-sm font-medium">Your tasks stay updated and accessible whether you're on desktop, tablet or mobile</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white/80 backdrop-blur-md shadow-xl border border-white/30">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure by Design</h3>
              <p className="text-gray-700 text-sm font-medium">Built-in authentication with Clerk ensures only you can access and manage your tasks.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white/80 backdrop-blur-md shadow-xl border border-white/30">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity History</h3>
              <p className="text-gray-700 text-sm font-medium">Track changes to your tasks with automatic logs of updates.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse -z-10"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000 -z-10"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000 -z-10"></div>
    </div>
  );
}
    