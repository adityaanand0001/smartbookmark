'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddBookmarkFormProps {
  onAdd: (title: string, url: string) => void;
  onCancel: () => void;
}

export const AddBookmarkForm: React.FC<AddBookmarkFormProps> = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    setIsValidating(true);

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // Simulate a tiny delay for "processing" feel
    setTimeout(() => {
        onAdd(title.trim(), formattedUrl);
        setIsValidating(false);
    }, 400);
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 10, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-white to-zinc-800 opacity-20" />

        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors p-2 hover:bg-zinc-900 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg font-medium text-white mb-1">Add Bookmark</h2>
        <p className="text-zinc-500 text-xs mb-8">Save a new URL to your collection.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold ml-1 group-focus-within:text-white transition-colors">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
              autoFocus
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold ml-1 group-focus-within:text-white transition-colors">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Site Name"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors hover:bg-zinc-900 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isValidating}
              className="px-6 py-2 text-xs font-medium text-black bg-white rounded-lg hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isValidating && <Loader2 className="w-3 h-3 animate-spin" />}
              Save Item
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};