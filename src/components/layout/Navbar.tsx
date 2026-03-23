"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="font-bold text-xl text-gray-900">SocialClub</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="/members" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium">
              Members
            </Link>
            <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Join Now
            </Link>
            <Link href="/admin" className="text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium">
              Admin
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-2">
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-gray-600 hover:text-indigo-600 px-2 py-2 text-sm font-medium">Home</Link>
              <Link href="/members" className="text-gray-600 hover:text-indigo-600 px-2 py-2 text-sm font-medium">Members</Link>
              <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center">Join Now</Link>
              <Link href="/admin" className="text-gray-500 hover:text-indigo-600 px-2 py-2 text-sm font-medium">Admin</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
