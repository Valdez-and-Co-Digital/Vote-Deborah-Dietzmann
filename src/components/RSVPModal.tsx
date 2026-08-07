"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface RSVPModalProps {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

export default function RSVPModal({ eventId, eventTitle, onClose }: RSVPModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    guests: 1,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const { error } = await supabase
        .from('rsvps')
        .insert([
          {
            event_id: eventId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            guests: formData.guests
          }
        ]);

      if (error) throw error;
      
      setStatus('success');
    } catch (error: any) {
      console.error('Error submitting RSVP:', error.message);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-primary p-6 text-on-primary flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold font-headline-md mb-1">RSVP to Event</h2>
            <p className="text-sm opacity-90">{eventTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">check</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">You're on the list!</h3>
              <p className="text-legal-gray mb-6">Thank you for your RSVP. We look forward to seeing you there.</p>
              <button 
                onClick={onClose}
                className="bg-primary hover:bg-primary-fixed-variant text-on-primary font-bold px-8 py-3 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-bold text-primary mb-1">First Name *</label>
                  <input 
                    type="text" 
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-outline-variant rounded p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-bold text-primary mb-1">Last Name *</label>
                  <input 
                    type="text" 
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-outline-variant rounded p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-primary mb-1">Email Address *</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-outline-variant rounded p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
                  placeholder="jane@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-primary mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-outline-variant rounded p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
                  placeholder="(210) 555-0123"
                />
              </div>

              <div>
                <label htmlFor="guests" className="block text-sm font-bold text-primary mb-1">Total Guests (including yourself)</label>
                <select 
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full border border-outline-variant rounded p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow bg-white"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                  ))}
                </select>
              </div>

              {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-3 rounded border border-red-100 text-sm">
                  {errorMessage}
                </div>
              )}

              <button 
                type="submit"
                disabled={status === 'loading'}
                className="mt-4 w-full bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-bold text-sm uppercase tracking-wider py-4 rounded shadow transition-all flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {status === 'loading' ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                    Submitting...
                  </>
                ) : 'Confirm RSVP'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
