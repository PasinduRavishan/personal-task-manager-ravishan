"use client";

import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface NavbarProps {
  showAuthButtons?: boolean; 
}

export default function Navbar({ showAuthButtons = false }: NavbarProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo and Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-900">Scheduly</span>
        </div>

        {/* Right: Navigation Actions */}
        <div className="flex items-center space-x-4">
          {isLoaded && (
            <>
              {!isSignedIn && showAuthButtons && (
                
                <div className="flex items-center space-x-4 relative z-50">
                  <SignInButton 
                    mode="redirect"
                    forceRedirectUrl="/dashboard"
                    signUpForceRedirectUrl="/dashboard"
                  >
                    <div className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer select-none">
                      Sign In
                    </div>
                  </SignInButton>
                  <SignUpButton 
                    mode="redirect"
                    forceRedirectUrl="/dashboard"
                    signInForceRedirectUrl="/dashboard"
                  >
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer select-none">
                      Sign Up
                    </div>
                  </SignUpButton>
                </div>
              )}
              
              {isSignedIn && !showAuthButtons && (
                
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                      userButtonPopoverCard: "shadow-lg",
                    }
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
