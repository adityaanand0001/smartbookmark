'use client';

import React from 'react';
import { User } from '../types';
import { Bookmark, LogOut } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
        <div className="flex items-center gap-2 text-indigo-600">
          <Bookmark className="w-6 h-6 fill-current" />
          <span className="text-xl font-bold tracking-tight text-slate-900">MarkKeeper</span>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">{user.name}</span>
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200"
              />
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <button
              onClick={onLogout}
              className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-slate-50"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};