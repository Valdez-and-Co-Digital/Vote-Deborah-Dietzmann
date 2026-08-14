import type { Metadata } from "next";
import "../../globals.css";
import { createClient } from '@/utils/supabase/server';
import Sidebar from './components/Sidebar';
import DesktopHeader from './components/DesktopHeader';
import { redirect } from 'next/navigation';

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

  if (user) {
    const allowedEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((email) => email.trim().toLowerCase());
    
    if (user.email && !allowedEmails.includes(user.email.toLowerCase())) {
      await supabase.auth.signOut();
      redirect('/admin/login?error=Unauthorized Account. This email is not on the admin allowlist.');
    }
  }

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a1f44" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&family=Montserrat:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-surface-container-lowest min-h-screen" suppressHydrationWarning>
        
        {/* Sidebar - Only show if logged in */}
        {user && (
          <Sidebar userEmail={user.email} />
        )}

        {/* Main Content Area */}
        <main className={`min-h-screen bg-surface-container-lowest pt-16 md:pt-0 pb-20 md:pb-0 ${user ? 'md:ml-60' : ''} flex flex-col`}>
          {user && <DesktopHeader />}
          <div className="flex-1">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
