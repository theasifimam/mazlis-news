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
    <section className="w-full my-10">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#b6c173] text-[#1b2111] p-8 md:p-12 border border-[#b6c173]/50 shadow-lg shadow-[#b6c173]/15 android-tile">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b2111]/10 backdrop-blur-md w-fit mx-auto lg:mx-0">
              <Mail size={15} className="text-[#1b2111]" />
              <span className="text-xs font-bold text-[#1b2111]">
                Weekly Newsletter
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-outfit tracking-tight leading-tight text-[#1b2111]">
              Independent Intelligence. Straight to your Inbox.
            </h2>
            <p className="text-[#2e371a] text-xs md:text-sm font-medium leading-relaxed">
              Stay updated with daily insights in technology, systems, and political philosophy directly on your device.
            </p>
          </div>

          <div className="w-full max-w-md">
            {subscribed ?
            <div className="flex items-center gap-3 p-4 rounded-full bg-[#1b2111]/10 border border-[#1b2111]/20 text-[#1b2111] backdrop-blur-md">
                <CheckCircle2 size={20} className="text-[#1b2111]" />
                <span className="text-xs font-bold">
                  Subscribed! You will receive daily updates.
                </span>
              </div> :

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="flex-1 px-5 py-3 rounded-full bg-white/60 backdrop-blur-md border border-[#1b2111]/20 text-[#1b2111] placeholder-[#4a5426] text-xs font-bold focus:outline-none focus:bg-white/80 transition-all" />
              
                <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#1b2111] text-[#f2f5e8] font-bold text-xs hover:bg-[#2b3316] transition-colors flex items-center justify-center gap-2 group shrink-0 shadow-md android-haptic">
                
                  <span>Subscribe</span>
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    </section>);

}