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
  ];

  return (
    <aside className="w-full md:w-60 bg-primary text-on-primary flex-shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-outline-variant/20 min-h-screen sticky top-0">
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
  );
}
