import React from "react";
import { Link } from "react-router";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-2.5" 
      style={{
        fontFamily: 'Inter, sans-serif',
        background: 'linear-gradient(135deg, #dbeafe, #e9d5ff)'
      }}
    >
      {/* Home Button */}
      <Link 
        to="/" 
        className="fixed top-5 left-5 bg-white/90 text-blue-600 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm z-50"
      >
        <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Home
      </Link>

      {/* Login Container */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex min-h-[600px]">
        {/* Left Panel */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-8 flex-col justify-center items-center text-white text-center">
          <div className="mb-6">
            <img 
              src="https://connect.sohub.com.bd/uploads/app_image/sohub-connect-logo.png" 
              alt="SOHUB Connect" 
              className="max-w-[180px] h-auto brightness-0 invert"
            />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            {window.location.pathname === '/signup' 
              ? 'Join Us Today!' 
              : window.location.pathname === '/forgot-password'
                ? 'Password Restoration!'
                : 'Welcome Back!'
            }
          </h2>
          <p className="text-lg opacity-90 mb-6">
            {window.location.pathname === '/signup' 
              ? 'Create your account and unlock amazing features'
              : window.location.pathname === '/forgot-password'
                ? 'Get reset instructions via email.'
                : 'Sign in to access your account and continue your journey'
            }
          </p>
          
          <ul className="list-none text-left space-y-3">
            {window.location.pathname === '/signup' ? (
              <>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Secure & Fast Registration
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Advanced Security Features
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  24/7 Customer Support
                </li>
              </>
            ) : window.location.pathname === '/forgot-password' ? (
              <>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure Login System
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Fast & Reliable Access
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  24/7 Customer Support
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure Login System
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Fast & Reliable Access
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  24/7 Customer Support
                </li>
              </>
            )}
          </ul>
        </div>
        
        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}