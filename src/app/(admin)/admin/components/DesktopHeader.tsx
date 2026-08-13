"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function DesktopHeader() {
  const pathname = usePathname();
  const [initials, setInitials] = useState('DD');

  useEffect(() => {
    const supabase = createClient();
    
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || 'Deborah Dietzmann';
        const calcInitials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'DD';
        setInitials(calcInitials);
      }
    };
    fetchUser();

    // Listen for updates to the user profile
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const fullName = session.user.user_metadata?.full_name || 'Deborah Dietzmann';
        const calcInitials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'DD';
        setInitials(calcInitials);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return (
    <div className="hidden md:flex h-20 border-b border-outline-variant/30 bg-neutral-white items-center justify-between px-8 sticky top-0 z-30">
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-heritage-gold flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-primary text-[18px]">gavel</span>
        </div>
        <div className="flex flex-col">
          <h1 className="font-headline-md text-primary text-xl font-bold leading-none tracking-tight">
            Deborah Dietzmann
          </h1>
          <span className="font-label-bold text-heritage-gold text-[11px] uppercase tracking-widest pl-1 mt-0.5">
            for Judge
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Search Bar - Visual only based on mockup */}
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-full text-sm w-64 focus:outline-none focus:border-primary"
          />
        </div>
        
        <div className="h-8 w-px bg-outline-variant/30 hidden lg:block"></div>
        
        <div className="flex items-center gap-4">
          <button className="text-outline hover:text-primary relative transition-colors">
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-neutral-white"></span>
          </button>
          <Link href="/admin/profile" className="w-10 h-10 rounded-full bg-[#0a1f44] flex items-center justify-center text-white hover:opacity-90 transition-opacity overflow-hidden ml-2">
            <span className="font-body-md font-light text-[15px] tracking-wide">{initials}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
