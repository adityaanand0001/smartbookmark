'use client';

import React from 'react';
import { Bookmark } from '../types';
import { ArrowUpRight, Trash2, Globe } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  viewMode: 'grid' | 'list';
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(5px)" },
  show: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 350, damping: 25 } 
  }
};

export const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, onDelete, viewMode }) => {
  if (bookmarks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="text-zinc-800 mb-2 font-thin text-4xl select-none">Empty</div>
        <p className="text-zinc-500 text-sm">Start building your collection.</p>
      </motion.div>
    );
  }

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return '';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  // --- LIST VIEW ---
  if (viewMode === 'list') {
    return (
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col w-full space-y-2">
        <AnimatePresence mode='popLayout'>
        {bookmarks.map((bookmark) => (
          <motion.div 
            layout
            variants={item}
            exit={{ opacity: 0, x: -20, filter: "blur(5px)" }}
            key={bookmark.id}
            className="group flex items-center justify-between py-3 px-4 border border-zinc-800/50 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all rounded-lg cursor-pointer backdrop-blur-sm"
            onClick={() => window.open(bookmark.url, '_blank')}
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
               <div className="w-8 h-8 rounded-md bg-zinc-950 flex items-center justify-center flex-shrink-0 border border-zinc-800/50 p-1.5 overflow-hidden">
                   <img 
                      src={getFavicon(bookmark.url)} 
                      className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                      alt="icon"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }} 
                   />
               </div>
               
               <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 min-w-0 flex-1">
                 <span className="text-zinc-200 group-hover:text-white transition-colors font-medium text-sm truncate">{bookmark.title}</span>
                 <span className="text-zinc-500 text-xs truncate opacity-70">{getDomain(bookmark.url)}</span>
               </div>
            </div>

            <div className="flex items-center gap-6">
                <span className="hidden sm:block text-zinc-600 text-xs font-mono">{formatDate(bookmark.created_at)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(bookmark.id);
                  }}
                  className="text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2 hover:bg-white/5 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </motion.div>
    );
  }

  // --- GRID VIEW (STANDARD DENSITY) ---
  return (
    <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
    >
      <AnimatePresence mode='popLayout'>
      {bookmarks.map((bookmark) => (
        <motion.div 
          layout
          variants={item}
          exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          key={bookmark.id}
          className="group relative bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-zinc-600 rounded-xl p-5 transition-all duration-300 flex flex-col h-44 backdrop-blur-md shadow-lg shadow-black/20"
          whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.3)" }}
        >
            {/* Header: Icon & Link */}
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-white border border-white/5 p-2 overflow-hidden shadow-inner">
                 <img 
                    src={getFavicon(bookmark.url)} 
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                    alt="icon"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }} 
                 />
              </div>
              
              <a 
                 href={bookmark.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-zinc-500 group-hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                 title="Open Link"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Content: Title & Domain */}
            <div className="flex-1 min-h-0">
              <h3 className="text-zinc-200 font-medium text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-white transition-colors">
                {bookmark.title}
              </h3>
              <div className="flex items-center gap-1.5 text-zinc-500 group-hover:text-zinc-400 text-xs transition-colors">
                <Globe className="w-3 h-3" />
                <span className="truncate font-mono opacity-80">{getDomain(bookmark.url)}</span>
              </div>
            </div>

            {/* Footer: Date & Delete */}
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 opacity-60 group-hover:opacity-100 transition-opacity">
                 <span className="text-xs text-zinc-600 font-mono">{formatDate(bookmark.created_at)}</span>
                 <motion.button
                    whileHover={{ scale: 1.1, color: "#ef4444" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(bookmark.id);
                    }}
                    className="text-zinc-500 hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-red-500/10"
                    title="Delete Bookmark"
                    >
                    <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
            </div>
        </motion.div>
      ))}
      </AnimatePresence>
    </motion.div>
  );
};