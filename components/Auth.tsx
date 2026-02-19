'use client';

import React, { useState, useEffect } from 'react';
import { Command, ArrowRight, Loader2, AlertTriangle, X, ExternalLink, Copy, Zap } from 'lucide-react';
import { supabase, isUsingDemoKeys, supabaseUrl } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingLines from './FloatingLines';

export const Auth: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setIsInIframe(window.self !== window.top);
    setCurrentUrl(window.location.href);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    if (isUsingDemoKeys) {
        setIsLoading(false);
        setError('Setup Required: You are using Demo Keys.');
        setShowHelp(true);
        return;
    }

    if (isInIframe) {
      setIsLoading(false);
      setError('Google Login cannot run in a Sandbox iframe.');
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Connection failed.');
      setShowHelp(true);
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Account created! Please check your email to verify.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCallbackUrl = () => {
     return `${supabaseUrl}/auth/v1/callback`;
  };

  return (
    <div className="flex min-h-screen w-full bg-black font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* Left Side - Visuals (Desktop only) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#050505] overflow-hidden flex-col justify-between p-12 border-r border-zinc-900">
         <div className="absolute inset-0 z-0">
            <FloatingLines 
                linesGradient={['#6366f1', '#a855f7', '#ec4899']} 
                animationSpeed={0.5} 
                lineCount={8}
                parallaxStrength={0.1}
                mixBlendMode="screen"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
         </div>

         <div className="relative z-10 flex items-center gap-3">
             <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10 shadow-lg">
                <Command className="w-4 h-4 text-white" />
             </div>
             <span className="text-white font-medium tracking-tight text-lg">AdityaMarker</span>
         </div>

         <div className="relative z-10 max-w-lg">
            <blockquote className="space-y-4">
                <p className="text-2xl font-medium leading-snug text-white">
                   "The most seamless way to organize, share, and discover your digital world."
                </p>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700"></div>
                    <div className="flex flex-col">
                        <span className="text-sm text-white font-medium">Made by Aditya</span>
                 
                    </div>
                </div>
            </blockquote>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black">
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-[320px] flex flex-col"
        >
            {/* Mobile Logo */}
            <div className="lg:hidden mb-10 self-center relative group">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
                    <Command className="w-6 h-6 text-white" />
                </div>
            </div>

            <div className="mb-8 text-center lg:text-left">
                <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                    {isSignUp ? 'Create an account' : 'Welcome back'}
                </h1>
                <p className="text-zinc-500 text-sm">
                    {isSignUp ? 'Enter your details below to create your account' : 'Enter your credentials to access your workspace.'}
                </p>
            </div>

            {isInIframe && (
            <div className="w-full mb-6">
                <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-3 flex items-start gap-3 backdrop-blur-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-zinc-400 text-[10px] leading-relaxed mb-2">
                    Sandbox detected. Open in new tab for Google Auth.
                    </p>
                    <a 
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/50 text-[10px] font-semibold py-1 px-3 rounded inline-flex items-center gap-1 transition-colors"
                    >
                    <span>Open New Tab</span>
                    <ExternalLink className="w-2 h-2" />
                    </a>
                </div>
                </div>
            </div>
            )}

            <div className="w-full space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-3">
                <div className="space-y-1">
                    <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all"
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-1">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all"
                        disabled={isLoading}
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-2"
                >
                    {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                    <>
                        {isSignUp ? 'Sign Up with Email' : 'Sign In with Email'}
                    </>
                    )}
                </motion.button>
            </form>
            
            <div className="relative w-full py-2 flex items-center gap-3">
                <div className="h-px bg-zinc-900 flex-1"></div>
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">Or continue with</span>
                <div className="h-px bg-zinc-900 flex-1"></div>
            </div>

            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={`w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm group ${isInIframe ? 'opacity-50' : ''}`}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all opacity-80" alt="G" />
                    <span>Google</span>
                    </>
                )}
            </motion.button>

            <p className="text-center text-xs text-zinc-500 mt-4">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button 
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                        setMessage('');
                    }}
                    className="text-white hover:underline underline-offset-4 font-medium transition-colors"
                >
                    {isSignUp ? 'Sign In' : "Sign Up"}
                </button>
            </p>
            </div>

            {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="w-full mt-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-red-400 text-xs font-medium">{error}</p>
                        {error.includes('Google') && (
                            <button onClick={() => setShowHelp(true)} className="mt-2 text-[10px] text-red-300 underline hover:text-red-200">
                                View configuration help
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
            )}
            
            {message && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-xs text-green-400 bg-green-900/10 p-3 rounded-lg w-full text-center border border-green-900/20">
                {message}
                </motion.div>
            )}

            <p className="mt-8 text-center text-[10px] text-zinc-600 px-8 lg:px-0">
                By clicking continue, you agree to our <a href="#" className="underline hover:text-zinc-500">Terms of Service</a> and <a href="#" className="underline hover:text-zinc-500">Privacy Policy</a>.
            </p>

            {/* Help Modal */}
            <AnimatePresence>
            {showHelp && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div 
                    initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                    className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl relative"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white text-sm font-semibold">Configuration Helper</h3>
                        <button onClick={() => setShowHelp(false)} className="hover:bg-zinc-900 rounded-md p-1 transition-colors"><X className="w-4 h-4 text-zinc-500" /></button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] text-zinc-500 mb-1.5 uppercase tracking-wider font-bold">Redirect URL</p>
                            <div className="bg-black border border-zinc-800 rounded p-2 flex justify-between items-center group">
                                <code className="text-[10px] text-zinc-400 font-mono truncate">{getCallbackUrl()}</code>
                                <button className="text-zinc-600 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(getCallbackUrl())}>
                                    <Copy className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 mb-1.5 uppercase tracking-wider font-bold">Site URL</p>
                            <div className="bg-black border border-zinc-800 rounded p-2 flex justify-between items-center group">
                                <code className="text-[10px] text-zinc-400 font-mono truncate">{window.location.origin}</code>
                                <button className="text-zinc-600 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(window.location.origin)}>
                                    <Copy className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
            )}
            </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};