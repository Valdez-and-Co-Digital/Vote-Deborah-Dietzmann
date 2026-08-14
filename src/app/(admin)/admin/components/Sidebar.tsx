"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface SidebarProps {
  userEmail?: string;
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [initials, setInitials] = useState('DD');
  const [firstName, setFirstName] = useState('Deborah');

  useEffect(() => {
    const supabase = createClient();
    
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || 'Deborah Dietzmann';
        const calcInitials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'DD';
        setInitials(calcInitials);
        setFirstName(fullName.split(' ')[0]);
      }
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const fullName = session.user.user_metadata?.full_name || 'Deborah Dietzmann';
        const calcInitials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'DD';
        setInitials(calcInitials);
        setFirstName(fullName.split(' ')[0]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const links = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
    { href: '/admin/events', label: 'Events', icon: 'event' },
    { href: '/admin/social-media', label: 'Social', icon: 'share' },
    { href: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
    { href: '/admin/volunteers', label: 'Volunteers', icon: 'groups' },
    { href: '/admin/logs', label: 'Audit Logs', icon: 'history' },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-white border-b border-outline-variant/30 flex items-center justify-between px-4 z-50">
        <div className="flex items-center flex-1">
          <div className="p-1 text-primary mr-1">
            <span className="material-symbols-outlined text-2xl">gavel</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-headline-sm text-primary text-[17px] leading-tight font-bold">Deborah Dietzmann</h1>
            <span className="font-headline-md text-primary text-[13px] italic opacity-90 pl-16 -mt-0.5 leading-tight">for Judge</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-primary/70 hover:text-primary relative">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-neutral-white"></span>
          </button>
          <Link href="/admin/profile" className="w-8 h-8 rounded-full bg-[#0a1f44] flex items-center justify-center overflow-hidden text-white hover:opacity-90 transition-opacity">
            <span className="font-body-md font-light text-[12px] tracking-wide">{initials}</span>
          </Link>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 w-60 h-screen bg-primary text-on-primary flex-col border-r border-outline-variant/20 z-40 overflow-y-auto">
      <div className="p-6">
        <h2 className="font-headline-sm text-heritage-gold mb-1">Campaign Admin</h2>
        <p className="font-body-sm opacity-80 truncate">{firstName}</p>
      </div>
      
      <nav className="flex-1 px-4 pb-4 flex flex-col gap-2 mt-4">
        {links.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-on-primary/10 text-heritage-gold' 
                  : 'text-on-primary/80 hover:bg-on-primary/10 hover:text-on-primary'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'icon-fill-1' : ''}`}>
                {link.icon}
              </span>
              <span className="font-label-bold tracking-wide">{link.label}</span>
            </Link>
          );
        })}
        
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-on-primary/10 transition-colors mt-auto opacity-80 hover:opacity-100 text-on-primary">
          <span className="material-symbols-outlined">open_in_new</span>
          <span className="font-label-bold tracking-wide">View Live Site</span>
        </Link>
      </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a1f44] border-t border-outline-variant/20 z-50 flex justify-around items-end h-[68px] pb-[env(safe-area-inset-bottom)]">
        {links.slice(0, 5).map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center w-full h-full pb-2 ${isActive ? 'bg-[#990000]' : ''}`}
            >
              <div className={`flex flex-col items-center gap-1 mt-auto ${isActive ? 'text-white' : 'text-on-primary/60'}`}>
                <span className={`material-symbols-outlined text-[24px] ${isActive ? 'icon-fill-1' : ''}`}>
                  {link.icon}
                </span>
                <span className="text-[10px] font-label-bold tracking-wider">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
