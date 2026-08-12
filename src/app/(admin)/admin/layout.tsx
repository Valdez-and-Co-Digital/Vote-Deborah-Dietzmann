import type { Metadata } from "next";
import Link from 'next/link';
import "../../globals.css";
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: "Admin Dashboard | Deborah Dietzmann",
  robots: "noindex, nofollow", // Prevent search engines from indexing the admin
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&family=Montserrat:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-surface-container-lowest min-h-screen flex flex-col md:flex-row">
        
        {/* Sidebar - Only show if logged in */}
        {user && (
          <aside className="w-full md:w-64 bg-primary text-on-primary flex-shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-outline-variant/20">
            <div className="p-6">
              <h2 className="font-headline-sm text-heritage-gold mb-1">Admin Panel</h2>
              <p className="font-body-sm opacity-80">{user.email}</p>
            </div>
            
            <nav className="flex-1 px-4 pb-4 flex flex-col gap-2">
              <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-on-primary/10 text-heritage-gold hover:bg-on-primary/20 transition-colors">
                <span className="material-symbols-outlined icon-fill-1">dashboard</span>
                <span className="font-label-bold tracking-wide">Dashboard</span>
              </Link>
              {/* Future links can go here */}
              <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-on-primary/10 transition-colors mt-auto opacity-80 hover:opacity-100">
                <span className="material-symbols-outlined">open_in_new</span>
                <span className="font-label-bold tracking-wide">View Live Site</span>
              </Link>
            </nav>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
