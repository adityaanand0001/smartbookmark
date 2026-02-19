'use client';

import React from 'react';
import { User } from '../types';
import { 
  LayoutGrid, 
  LogOut,
  Command,
  User as UserIcon,
  Plus
} from 'lucide-react';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex group fixed left-0 top-0 h-screen bg-[#050505] border-r border-zinc-900/50 z-50 w-16 hover:w-64 transition-[width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden shadow-2xl shadow-black flex-col">
        <div className="flex flex-col h-full py-6 px-0">
            {/* Logo Section */}
            <div className="flex items-center px-5 mb-8 min-w-[16rem]">
            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-white">
                <Command className="w-5 h-5" />
            </div>
            <span className="ml-4 font-semibold text-sm tracking-tight text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75">
                AdityaMarker
            </span>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-1 px-3">
            <SidebarItem icon={LayoutGrid} label="Dashboard" active />
            </nav>

            {/* Footer Actions */}
            <div className="flex flex-col gap-2 px-3 mt-auto pb-6 border-t border-zinc-900/50 pt-4">
            <button 
                onClick={onLogout}
                className="flex items-center p-3 text-zinc-500 hover:text-red-400 rounded-xl transition-colors min-w-max hover:bg-red-950/10 group/btn"
                title="Sign out"
            >
                <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover/btn:scale-110" />
                <span className="ml-4 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75">
                Sign Out
                </span>
            </button>
            
            <div className="flex items-center p-2 mt-2 rounded-xl bg-zinc-900/30 border border-zinc-800/50 min-w-max">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-zinc-800">
                    {user.avatar ? (
                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-zinc-500" />
                        </div>
                    )}
                </div>
                <div className="ml-3 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    <span className="text-xs text-zinc-200 font-medium truncate max-w-[140px]">{user.name}</span>
                    <span className="text-[10px] text-zinc-500 truncate max-w-[140px]">{user.email}</span>
                </div>
            </div>
            </div>
        </div>
      </aside>

      {/* --- MOBILE TOP BAR --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#050505]/90 backdrop-blur-xl border-b border-zinc-800 z-40 flex items-center justify-between px-4">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
                <Command className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white tracking-tight text-sm">AdityaMarker</span>
         </div>
         
         <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-zinc-800 bg-zinc-900">
             {user.avatar ? (
                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                   <UserIcon className="w-4 h-4 text-zinc-500" />
                </div>
             )}
         </div>
      </div>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050505]/95 backdrop-blur-xl border-t border-zinc-800 z-40 flex items-center justify-around px-2 pb-1">
         <div className="flex flex-col items-center justify-center w-16 h-full gap-1 text-white">
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] font-medium opacity-80">Home</span>
         </div>

         <div className="w-px h-8 bg-zinc-800/50"></div>
         
         <button 
           onClick={onLogout}
           className="flex flex-col items-center justify-center w-16 h-full gap-1 text-zinc-500 active:text-red-400 transition-colors"
         >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-medium opacity-80">Sign Out</span>
         </button>
      </nav>
    </>
  );
};

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <button className={`flex items-center p-3 rounded-xl transition-all duration-200 min-w-max group/item ${active ? 'bg-zinc-900 text-white shadow-inner border border-zinc-800' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'}`}>
    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover/item:scale-110 ${active ? 'text-white' : ''}`} />
    <span className="ml-4 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75 tracking-wide">
      {label}
    </span>
  </button>
);