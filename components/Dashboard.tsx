'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User, Bookmark } from '../types';
import { BookmarkList } from './BookmarkList';
import { AddBookmarkForm } from './AddBookmarkForm';
import { Plus, Search, Grid, List as ListIcon } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
    
    // Subscribe to real-time changes for this user's bookmarks
    const channel = supabase
      .channel('realtime bookmarks')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}` 
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
             const newBookmark = payload.new as Bookmark;
             setBookmarks(prev => {
                // Prevent duplicates if specific ID already exists (e.g. from optimistic update)
                if (prev.some(b => b.id === newBookmark.id)) return prev;
                return [newBookmark, ...prev];
             });
          } else if (payload.eventType === 'DELETE' && payload.old) {
             // Immediately remove the deleted item from state
             const deletedId = payload.old.id;
             setBookmarks(prev => prev.filter(b => b.id !== deletedId));
          } else if (payload.eventType === 'UPDATE' && payload.new) {
             // Update the specific item in state
             const updatedBookmark = payload.new as Bookmark;
             setBookmarks(prev => prev.map(b => b.id === updatedBookmark.id ? updatedBookmark : b));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookmarks, user.id]);

  const handleAddBookmark = async (title: string, url: string) => {
    try {
      // 1. Insert into DB and select the returned row
      const { data, error } = await supabase
        .from('bookmarks')
        .insert([{ title, url, user_id: user.id }])
        .select();

      if (error) throw error;

      // 2. Manually update local state immediately (Optimistic UI)
      if (data) {
        setBookmarks(prev => [data[0], ...prev]);
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding bookmark:', error);
      alert('Failed to add bookmark');
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    // 1. Optimistic UI update
    const previousBookmarks = [...bookmarks];
    setBookmarks(prev => prev.filter(b => b.id !== id));

    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id);
      if (error) {
          throw error;
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      // Revert if failed
      setBookmarks(previousBookmarks);
      alert('Failed to delete bookmark');
    }
  };

  const filteredBookmarks = bookmarks.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 py-6 md:px-12 md:py-10 w-full max-w-[1920px] mx-auto min-h-screen flex flex-col"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
        <div className="space-y-1">
          <motion.h1 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold tracking-tight text-white"
          >
            Collections
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-zinc-500 text-sm"
          >
            {loading ? 'Syncing...' : `${bookmarks.length} saved items`}
          </motion.p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative group flex-grow md:flex-grow-0 md:w-72">
             <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4 group-focus-within:text-white transition-colors" />
             <input 
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-zinc-800 text-sm py-2 pl-8 text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder-zinc-700"
             />
          </div>

          <div className="h-6 w-px bg-zinc-800 mx-2 hidden md:block"></div>

          <div className="flex items-center justify-between gap-4">
            {/* View Toggles */}
            <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                <Grid className="w-4 h-4" />
                </button>
                <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                <ListIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Add Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)] flex-grow sm:flex-grow-0 justify-center"
            >
                <Plus className="w-4 h-4" />
                <span>New</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        <AnimatePresence>
            {isFormOpen && (
            <AddBookmarkForm 
                onAdd={handleAddBookmark} 
                onCancel={() => setIsFormOpen(false)} 
            />
            )}
        </AnimatePresence>

        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-full h-44 bg-zinc-900/30 rounded-xl animate-pulse border border-zinc-800/50" />
                ))}
            </div>
        ) : (
            <BookmarkList 
              bookmarks={filteredBookmarks} 
              onDelete={handleDeleteBookmark}
              viewMode={viewMode}
            />
        )}
      </div>
    </motion.div>
  );
};