'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/about', label: 'Meet Deborah' },
  { href: '/experience', label: 'Experience' },
  { href: '/issues', label: 'Platform' },
  { href: '/endorsements', label: 'Endorsements' },
  { href: '/volunteer', label: 'Get Involved' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-on-primary w-full top-0 border-b border-heritage-gold shadow-md z-50 fixed">
      <div className="flex justify-between items-center px-5 md:px-16 py-4 w-full max-w-[1200px] mx-auto">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined icon-fill-1 text-heritage-gold text-3xl">gavel</span>
          <span className="text-heritage-gold font-bold uppercase tracking-wider text-sm md:text-base" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
            Deborah Dietzmann
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  relative text-xs font-bold uppercase tracking-wider transition-colors duration-200 pb-1
                  ${isActive
                    ? 'text-heritage-gold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-heritage-gold'
                    : 'text-on-primary opacity-70 hover:opacity-100 hover:text-heritage-gold'
                  }
                `}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Hamburger */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-heritage-gold"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-primary border-t border-heritage-gold/30 px-5 py-4 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`
                  py-3 px-4 text-sm font-bold uppercase tracking-wider rounded transition-colors duration-200
                  ${isActive
                    ? 'text-heritage-gold bg-heritage-gold/10 border-l-4 border-heritage-gold'
                    : 'text-on-primary opacity-70 hover:opacity-100 hover:text-heritage-gold hover:bg-heritage-gold/5 border-l-4 border-transparent'
                  }
                `}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
