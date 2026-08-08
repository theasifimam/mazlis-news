"use client";

import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Subscribed to Mazlis Dispatch!');
    setEmail('');
  };

  return (
    <section className="w-full my-20">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0c0c0e] text-white p-10 md:p-16 border border-white/10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 w-fit mx-auto lg:mx-0">
              <Mail size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">
                Weekly Dispatch
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-outfit tracking-tight leading-tight">
              Independent Journalism. Straight to your Inbox.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-light">
              Join thousands of readers following critical investigations in architecture, technology, and political philosophy.
            </p>
          </div>

          <div className="w-full max-w-md">
            {subscribed ?
            <div className="flex items-center gap-3 p-5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                <CheckCircle2 size={24} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  You are subscribed to the weekly dispatch.
                </span>
              </div> :

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-white transition-colors" />
              
                <button
                type="submit"
                className="px-8 py-4 rounded-full bg-white text-zinc-950 font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 group shrink-0">
                
                  Subscribe
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    </section>);

}