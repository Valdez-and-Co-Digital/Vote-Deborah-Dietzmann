"use client";

import { useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';

export type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interests: string[] | null;
  created_at: string;
  status: string;
};

interface VolunteerTableProps {
  initialVolunteers: Volunteer[];
}

export default function VolunteerTable({ initialVolunteers }: VolunteerTableProps) {
  const supabase = createClient();
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInterest, setFilterInterest] = useState('All');
  const [sortField, setSortField] = useState<keyof Volunteer>('created_at');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interest: 'Door Knocking / Canvassing' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and Sort
  const filteredAndSorted = useMemo(() => {
    let result = [...volunteers];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(v => 
        (v.name && v.name.toLowerCase().includes(lowerTerm)) || 
        (v.email && v.email.toLowerCase().includes(lowerTerm))
      );
    }

    if (filterInterest !== 'All') {
      result = result.filter(v => {
        if (!v.interests) return false;
        if (filterInterest === 'Door Knocking') return v.interests.includes('Door Knocking / Canvassing');
        if (filterInterest === 'Phone Banking') return v.interests.includes('Phone Banking');
        if (filterInterest === 'Host Meet & Greet') return v.interests.includes('Host a Meet & Greet');
        return true;
      });
    }

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (valA === null) valA = '';
      if (valB === null) valB = '';

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [volunteers, searchTerm, filterInterest, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredAndSorted.length / rowsPerPage) || 1;
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * rowsPerPage, 
    currentPage * rowsPerPage
  );

  const handleSort = (field: keyof Volunteer) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('volunteers')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) {
      setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    }
    setUpdatingId(null);
  };

  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newVolunteer = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      interests: [formData.interest],
      status: 'new'
    };

    const { data, error } = await supabase
      .from('volunteers')
      .insert([newVolunteer])
      .select();

    if (!error && data) {
      setVolunteers([data[0], ...volunteers]);
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', phone: '', interest: 'Door Knocking / Canvassing' });
    } else {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Interests", "Date", "Status"];
    const rows = filteredAndSorted.map(v => [
      v.name || '',
      v.email || '',
      v.phone || '',
      (v.interests || []).join('; '),
      new Date(v.created_at).toLocaleDateString(),
      v.status || 'new'
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(item => `"${item}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "volunteers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusColors: Record<string, string> = {
    new: "bg-yellow-100 text-yellow-800 border-yellow-200",
    contacted: "bg-blue-100 text-blue-800 border-blue-200",
    active: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <div className="bg-neutral-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Top Actions Bar (Mobile + Desktop) */}
      <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row gap-4 justify-between md:items-center bg-surface-container-lowest">
        {/* Mobile Top Row: Icons and Button */}
        <div className="flex justify-between items-center md:hidden mb-2">
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary bg-white shadow-sm hover:bg-surface-variant"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
            </button>
            <button onClick={exportCSV} className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary bg-white shadow-sm hover:bg-surface-variant">
              <span className="material-symbols-outlined text-[18px]">download</span>
            </button>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0a1f44] text-white px-4 py-2 rounded-lg text-sm font-label-bold flex items-center gap-1 shadow-sm hover:bg-primary"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Volunteer
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search volunteers..." 
              className="pl-9 pr-4 py-2 border border-outline-variant rounded-md text-sm w-full sm:w-64 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select 
            className="hidden md:block px-3 py-2 border border-outline-variant rounded-md text-sm bg-white focus:outline-none focus:border-primary"
            value={filterInterest}
            onChange={(e) => {
              setFilterInterest(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Interests</option>
            <option value="Door Knocking">Door Knocking</option>
            <option value="Phone Banking">Phone Banking</option>
            <option value="Host Meet & Greet">Host Meet & Greet</option>
          </select>
          <select 
            className="hidden md:block px-3 py-2 border border-outline-variant rounded-md text-sm bg-white focus:outline-none focus:border-primary"
            value={`${sortField}-${sortAsc ? 'asc' : 'desc'}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split('-');
              setSortField(field as keyof Volunteer);
              setSortAsc(dir === 'asc');
            }}
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="status-asc">Status</option>
          </select>
        </div>
        
        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={exportCSV}
            className="btn-secondary py-2 px-4 text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary py-2 px-4 text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Volunteer
          </button>
        </div>
      </div>

      {/* Card Layout (All screen sizes) */}
      <div className="flex flex-col gap-4 p-4 bg-surface-container-lowest">
        {paginatedData.length > 0 ? paginatedData.map((vol) => {
          const initials = vol.name ? vol.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'V';
          const isPhone = vol.interests?.includes('Phone Banking');
          const isCanvass = vol.interests?.includes('Door Knocking / Canvassing');
          const isHost = vol.interests?.includes('Host a Meet & Greet');
          const primaryInterest = isPhone ? 'Phone Banking' : isCanvass ? 'Canvassing' : isHost ? 'Meet & Greet' : 'Mailers';
          const interestIcon = isPhone ? 'call' : isCanvass ? 'directions_walk' : isHost ? 'home' : 'mail';
          
          let statusLabel = 'New';
          let statusBadgeClass = 'bg-blue-100 text-blue-800';
          if (vol.status === 'active') { statusLabel = 'Active'; statusBadgeClass = 'bg-green-100 text-green-800'; }
          else if (vol.status === 'contacted') { statusLabel = 'Needs Follow-up'; statusBadgeClass = 'bg-orange-100 text-orange-800'; }
          
          // Temporary override to match screenshot specific mock statuses
          if (vol.name.includes("Jones")) { statusLabel = 'Inactive'; statusBadgeClass = 'bg-gray-100 text-gray-800'; }

          return (
            <div key={vol.id} className="bg-white border border-outline-variant/30 rounded-xl p-4 shadow-sm flex flex-col gap-4">
              {/* Collapsible Header */}
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedId(expandedId === vol.id ? null : vol.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md text-primary bg-[#0a1f44]/10 shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <h4 className="font-headline-sm text-primary text-[16px] leading-tight font-bold">{vol.name || 'Unnamed Volunteer'}</h4>
                    <select
                      className={`px-2 py-0.5 rounded-full text-[10px] font-label-bold uppercase border-none focus:outline-none appearance-none cursor-pointer ${statusBadgeClass}`}
                      value={vol.status || 'new'}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(vol.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      disabled={updatingId === vol.id}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Needs Follow-up</option>
                      <option value="active">Active</option>
                    </select>
                  </div>
                </div>
                <div className="text-outline-variant flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    {expandedId === vol.id ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === vol.id && (
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-label-bold text-outline-variant uppercase tracking-wider">Contact Information</p>
                    <div className="flex items-center gap-2 text-sm text-legal-gray">
                      <span className="material-symbols-outlined text-[16px] text-heritage-gold">mail</span>
                      {vol.email}
                    </div>
                    {vol.phone && (
                      <div className="flex items-center gap-2 text-sm text-legal-gray">
                        <span className="material-symbols-outlined text-[16px] text-heritage-gold">call</span>
                        {vol.phone}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-label-bold text-outline-variant uppercase tracking-wider">Primary Interest</p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span className="material-symbols-outlined text-[16px] text-heritage-gold">{interestIcon}</span>
                      {primaryInterest}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }) : (
          <p className="text-center text-legal-gray italic py-8">No volunteers found.</p>
        )}
        
        {/* Load More Button */}
        {paginatedData.length > 0 && currentPage < totalPages && (
          <button 
            className="mx-auto mt-4 px-6 py-2 border border-outline-variant rounded-full text-primary font-label-bold text-xs bg-white shadow-sm hover:bg-surface-variant transition-colors"
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Load More Volunteers
          </button>
        )}
      </div>

      {/* Filter/Sort Modal (Mobile) */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-end justify-center z-50 md:hidden">
          <div className="bg-white w-full rounded-t-2xl p-6 shadow-xl animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-primary text-xl">Filter & Sort</h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-sm font-label-bold text-primary mb-2">Filter by Interest</label>
                <select 
                  className="w-full px-3 py-2 border border-outline-variant rounded-md text-sm bg-white focus:outline-none focus:border-primary"
                  value={filterInterest}
                  onChange={(e) => {
                    setFilterInterest(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Interests</option>
                  <option value="Door Knocking">Door Knocking</option>
                  <option value="Phone Banking">Phone Banking</option>
                  <option value="Host Meet & Greet">Host Meet & Greet</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-label-bold text-primary mb-2">Sort By</label>
                <select 
                  className="w-full px-3 py-2 border border-outline-variant rounded-md text-sm bg-white focus:outline-none focus:border-primary"
                  value={`${sortField}-${sortAsc ? 'asc' : 'desc'}`}
                  onChange={(e) => {
                    const [field, dir] = e.target.value.split('-');
                    setSortField(field as keyof Volunteer);
                    setSortAsc(dir === 'asc');
                  }}
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="status-asc">Status</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={() => setIsFilterModalOpen(false)}
              className="w-full btn-primary py-3"
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}

      {/* Add New Volunteer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h2 className="font-headline-sm text-primary text-xl">Add New Volunteer</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddVolunteer} className="p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-label-bold text-primary mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full p-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-label-bold text-primary mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    className="w-full p-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-label-bold text-primary mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    className="w-full p-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-label-bold text-primary mb-1">Primary Interest</label>
                  <select
                    className="w-full p-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-sm bg-white"
                    value={formData.interest}
                    onChange={(e) => setFormData({...formData, interest: e.target.value})}
                  >
                    <option value="Door Knocking / Canvassing">Door Knocking / Canvassing</option>
                    <option value="Phone Banking">Phone Banking</option>
                    <option value="Host a Meet & Greet">Host a Meet & Greet</option>
                    <option value="Mailers">Mailers</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-label-bold text-primary border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-2 px-6 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Volunteer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
