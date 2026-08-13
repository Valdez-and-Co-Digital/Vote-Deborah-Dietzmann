"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullName, setFullName] = useState('Deborah Dietzmann');
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const [role, setRole] = useState('System Admin');
  const [passwordLastChanged, setPasswordLastChanged] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
      if (user?.user_metadata?.role) {
        setRole(user.user_metadata.role);
      }
      if (user?.user_metadata?.password_last_changed) {
        setPasswordLastChanged(user.user_metadata.password_last_changed);
      }
    };
    fetchUser();
  }, []);

  const handleRoleChange = async (newRole: string) => {
    setRole(newRole);
    const supabase = createClient();
    await supabase.auth.updateUser({
      data: { role: newRole }
    });
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: newName }
    });
    
    if (!error) {
      setFullName(newName);
      setIsEditingName(false);
    } else {
      alert("Failed to update name");
    }
    setIsSaving(false);
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    setIsResetting(true);
    setResetMessage('');
    
    const supabase = createClient();
    
    // In a real app, this sends the email. We also update the metadata here 
    // to simulate tracking the date it was changed for the mockup.
    const now = new Date().toISOString();
    
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/admin/profile`,
    });

    if (!error) {
      await supabase.auth.updateUser({
        data: { password_last_changed: now }
      });
      setPasswordLastChanged(now);
      setResetMessage('Password reset email sent! Check your inbox.');
    } else {
      setResetMessage('Failed to send reset email.');
    }
    
    setIsResetting(false);
  };

  const email = user?.email || "deborah.dietzmann@campaign.com";
  // Extract initials or default
  const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'DD';

  // Calculate days since password change
  let daysSinceChange = 45;
  if (passwordLastChanged) {
    const diffTime = Math.abs(new Date().getTime() - new Date(passwordLastChanged).getTime());
    daysSinceChange = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-headline-lg text-primary text-2xl md:text-3xl mb-2">My Profile</h1>
        <p className="font-body-md text-legal-gray">Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Profile Card */}
        <div className="lg:col-span-2 bg-neutral-white border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Navy Banner */}
          <div className="h-28 bg-[#0a1f44] relative w-full overflow-hidden">
            {/* Optional subtle texture/pattern could go here */}
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>
          </div>
          
          <div className="px-6 pb-8 relative">
            {/* Avatar overlapping the banner */}
            <div className="w-24 h-24 rounded-full border-4 border-white bg-surface-container flex items-center justify-center -mt-12 mb-4 relative z-10 shadow-sm text-primary font-headline-lg text-3xl">
              {initials}
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                {isEditingName ? (
                  <div className="flex items-center gap-2 mb-1">
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      className="px-3 py-1 border border-outline-variant rounded-md text-primary font-headline-md text-xl md:text-2xl w-64 focus:outline-none focus:border-primary"
                      autoFocus
                    />
                    <button onClick={handleSaveName} disabled={isSaving} className="text-green-700 hover:text-green-800 p-1 bg-green-100 rounded-md">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </button>
                    <button onClick={() => setIsEditingName(false)} disabled={isSaving} className="text-red-700 hover:text-red-800 p-1 bg-red-100 rounded-md">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h2 className="font-headline-md text-primary text-xl md:text-2xl">{fullName}</h2>
                    <button 
                      onClick={() => {
                        setNewName(fullName);
                        setIsEditingName(true);
                      }}
                      className="text-outline-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-heritage-gold mt-1 font-label-bold text-[10px] tracking-wider uppercase">
                  <span className="material-symbols-outlined text-[14px]">shield_person</span>
                  <select 
                    value={role} 
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="bg-transparent border-none outline-none cursor-pointer text-heritage-gold font-label-bold uppercase tracking-wider appearance-none hover:opacity-80 transition-opacity"
                  >
                    <option value="System Admin">System Admin</option>
                    <option value="Candidate">Candidate</option>
                    <option value="Treasurer">Treasurer</option>
                  </select>
                  <span className="material-symbols-outlined text-[12px] opacity-70 -ml-1">expand_more</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-[11px] font-bold uppercase rounded-full tracking-wider border border-green-200">
                Active
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-outline-variant/30 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-label-bold text-outline-variant uppercase tracking-wider mb-0.5">Primary Email</div>
                    <div className="font-body-md text-primary text-sm">{email}</div>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-outline-variant group-hover:text-primary transition-colors hover:bg-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-outline-variant/30 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-label-bold text-outline-variant uppercase tracking-wider mb-0.5">Access Level</div>
                    <div className="font-body-md text-primary text-sm">Full Administrative Rights</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Security Card */}
        <div className="bg-neutral-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-outline-variant/30">
            <span className="material-symbols-outlined text-[#8B0000]">lock_reset</span>
            <h3 className="font-headline-md text-primary text-lg">Security</h3>
          </div>
          
          <p className="font-body-sm text-legal-gray mb-6 leading-relaxed">
            It is recommended to update your administrative password every 90 days to maintain dashboard security protocols.
          </p>
          
          <div className="flex items-center gap-2 text-xs text-outline mb-6 font-body-sm">
            <span className="material-symbols-outlined text-[16px]">history</span>
            Last changed: {daysSinceChange === 0 ? 'Today' : `${daysSinceChange} days ago`}
          </div>
          
          <div className="mt-auto pt-4 flex flex-col gap-2">
            {resetMessage && (
              <div className={`text-xs p-2 rounded ${resetMessage.includes('sent') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {resetMessage}
              </div>
            )}
            <button 
              onClick={handleResetPassword}
              disabled={isResetting || !user?.email}
              className="w-full bg-[#8B0000] hover:bg-[#6b0000] disabled:bg-outline-variant disabled:cursor-not-allowed text-white py-3 rounded-md flex items-center justify-center gap-2 font-label-bold transition-colors shadow-sm text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isResetting ? 'hourglass_empty' : 'key'}
              </span>
              {isResetting ? 'Sending...' : 'Reset Password'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
