"use client";

import { useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';

type Volunteer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  interest_door_knocking: boolean;
  interest_phone_banking: boolean;
  interest_host_event: boolean;
  interest_other: boolean;
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

  // Filter and Sort
  const filteredAndSorted = useMemo(() => {
    let result = [...volunteers];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(v => 
        v.first_name.toLowerCase().includes(lowerTerm) || 
        v.last_name.toLowerCase().includes(lowerTerm) || 
        v.email.toLowerCase().includes(lowerTerm)
      );
    }

    if (filterInterest !== 'All') {
      result = result.filter(v => {
        if (filterInterest === 'Door Knocking') return v.interest_door_knocking;
        if (filterInterest === 'Phone Banking') return v.interest_phone_banking;
        if (filterInterest === 'Host Meet & Greet') return v.interest_host_event;
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

  const exportCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Phone", "Door Knocking", "Phone Banking", "Host Event", "Date", "Status"];
    const rows = filteredAndSorted.map(v => [
      v.first_name,
      v.last_name,
      v.email,
      v.phone || '',
      v.interest_door_knocking ? 'Yes' : 'No',
      v.interest_phone_banking ? 'Yes' : 'No',
      v.interest_host_event ? 'Yes' : 'No',
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
      {/* Filter Bar */}
      <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container-lowest">
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
            className="px-3 py-2 border border-outline-variant rounded-md text-sm bg-white focus:outline-none focus:border-primary"
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
        <button 
          onClick={exportCSV}
          className="btn-secondary py-2 px-4 text-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface-container-low text-primary uppercase font-label-bold text-xs border-b border-outline-variant">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:bg-surface-variant transition-colors" onClick={() => handleSort('first_name')}>
                <div className="flex items-center gap-1">Name <span className="material-symbols-outlined text-[14px]">sort</span></div>
              </th>
              <th className="px-6 py-4">Email & Phone</th>
              <th className="px-6 py-4">Interests</th>
              <th className="px-6 py-4 cursor-pointer hover:bg-surface-variant transition-colors" onClick={() => handleSort('created_at')}>
                <div className="flex items-center gap-1">Signed Up <span className="material-symbols-outlined text-[14px]">sort</span></div>
              </th>
              <th className="px-6 py-4 cursor-pointer hover:bg-surface-variant transition-colors" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">Status <span className="material-symbols-outlined text-[14px]">sort</span></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {paginatedData.length > 0 ? paginatedData.map((vol, i) => (
              <tr key={vol.id} className={i % 2 === 0 ? 'bg-white' : 'bg-surface-container-lowest/50'}>
                <td className="px-6 py-4 font-label-bold text-primary">
                  {vol.first_name} {vol.last_name}
                </td>
                <td className="px-6 py-4">
                  <div className="text-on-surface">{vol.email}</div>
                  <div className="text-xs text-legal-gray">{vol.phone || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 flex flex-wrap gap-1 max-w-[200px]">
                  {vol.interest_door_knocking && <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] uppercase font-bold rounded-full">Door</span>}
                  {vol.interest_phone_banking && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] uppercase font-bold rounded-full">Phone</span>}
                  {vol.interest_host_event && <span className="px-2 py-1 bg-purple-100 text-purple-800 text-[10px] uppercase font-bold rounded-full">Host</span>}
                  {!vol.interest_door_knocking && !vol.interest_phone_banking && !vol.interest_host_event && vol.interest_other && <span className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] uppercase font-bold rounded-full">Other</span>}
                </td>
                <td className="px-6 py-4 text-on-surface">
                  {new Date(vol.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <select
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase border focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-center cursor-pointer ${statusColors[vol.status || 'new'] || statusColors.new} ${updatingId === vol.id ? 'opacity-50' : ''}`}
                    value={vol.status || 'new'}
                    onChange={(e) => handleStatusChange(vol.id, e.target.value)}
                    disabled={updatingId === vol.id}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="active">Active</option>
                  </select>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-legal-gray italic">
                  No volunteers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest text-sm">
        <span className="text-legal-gray">
          Showing {Math.min(filteredAndSorted.length, (currentPage - 1) * rowsPerPage + 1)}-{Math.min(filteredAndSorted.length, currentPage * rowsPerPage)} of {filteredAndSorted.length}
        </span>
        <div className="flex gap-2">
          <button 
            className="px-3 py-1 border border-outline-variant rounded bg-white hover:bg-surface-variant disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <button 
            className="px-3 py-1 border border-outline-variant rounded bg-white hover:bg-surface-variant disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
