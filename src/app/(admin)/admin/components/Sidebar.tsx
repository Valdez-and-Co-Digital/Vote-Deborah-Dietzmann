"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  userEmail?: string;
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
    { href: '/admin/volunteers', label: 'Volunteers', icon: 'groups' },
    { href: '/admin/events', label: 'Events', icon: 'event' },
    { href: '/admin/analytics', label: 'Site Analytics', icon: 'analytics' },
    { href: '/admin/logs', label: 'Audit Logs', icon: 'history' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 w-60 h-screen bg-primary text-on-primary flex-col border-r border-outline-variant/20 z-40 overflow-y-auto">
      <div className="p-6">
        <h2 className="font-headline-sm text-heritage-gold mb-1">Campaign Admin</h2>
        <p className="font-body-sm opacity-80 truncate">{userEmail || 'Admin User'}</p>
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-outline-variant/20 z-50 flex justify-around items-center px-1 py-2 pb-[env(safe-area-inset-bottom)]">
        {links.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-1 transition-colors ${
                isActive 
                  ? 'text-heritage-gold' 
                  : 'text-on-primary/60 hover:text-on-primary'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${isActive ? 'icon-fill-1' : ''}`}>
                {link.icon}
              </span>
              <span className="text-[10px] font-label-bold tracking-wider">{link.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
