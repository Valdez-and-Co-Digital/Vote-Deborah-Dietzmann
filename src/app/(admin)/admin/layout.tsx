import type { Metadata } from "next";
import "../../globals.css";
import { createClient } from '@/utils/supabase/server';
import Sidebar from './components/Sidebar';

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
          <Sidebar userEmail={user.email} />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-auto bg-surface-container-lowest">
          {children}
        </main>
      </body>
    </html>
  );
}
