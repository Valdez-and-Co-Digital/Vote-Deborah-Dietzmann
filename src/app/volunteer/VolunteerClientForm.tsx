"use client";

import { useState } from 'react';
import Button from "@/components/Button";
import { supabase } from '@/lib/supabase';

export default function VolunteerClientForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userName, setUserName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get('Name') as string;
    const email = formData.get('Email') as string;
    const phone = formData.get('Phone') as string;
    setUserName(name);
    
    // Collect checkboxes
    const interests = [];
    if (formData.get('Door Knocking / Canvassing')) interests.push('Door Knocking / Canvassing');
    if (formData.get('Phone Banking')) interests.push('Phone Banking');
    if (formData.get('Host a Meet & Greet')) interests.push('Host a Meet & Greet');

    try {
      // 1. Save to Supabase Database
      const { error: dbError } = await supabase
        .from('volunteers')
        .insert([{
          name,
          email,
          phone,
          interests
        }]);

      if (dbError) {
        throw new Error("Failed to save to database: " + dbError.message);
      }

      // 2. Send Email via Formspree
      // We still submit to Formspree so you get the email notification
      const formspreeResponse = await fetch('https://formspree.io/f/xgawedvk', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!formspreeResponse.ok) {
        throw new Error("Failed to send email notification.");
      }

      // Success
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-primary text-on-primary rounded-2xl p-8 shadow-xl text-center flex flex-col items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined text-6xl text-heritage-gold mb-4">check_circle</span>
        <h2 className="font-headline-md text-2xl text-heritage-gold mb-2">Thank You, {userName.split(' ')[0]}!</h2>
        <p className="font-body-md text-inverse-on-surface opacity-90">
          Your information has been securely saved. Our campaign team will be in touch with you shortly with next steps.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-primary text-on-primary rounded-2xl p-8 shadow-xl">
      <h2 className="font-headline-md text-headline-md text-heritage-gold mb-2">Sign Up to Volunteer</h2>
      <p className="font-body-md text-body-md text-inverse-on-surface opacity-90 mb-8">
        Fill out the form below and our campaign team will be in touch with next steps.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Formspree Honeypot */}
        <input type="text" name="_gotcha" style={{ display: 'none' }} />
        
        <div>
          <label htmlFor="v-name" className="block font-label-bold text-label-bold text-heritage-gold uppercase mb-2">Full Name</label>
          <input 
            type="text" id="v-name" name="Name" required
            className="w-full bg-on-primary/10 border border-on-primary/20 text-on-primary placeholder:text-on-primary/50 px-4 py-3 rounded-lg focus:outline-none focus:border-heritage-gold transition-colors" 
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label htmlFor="v-email" className="block font-label-bold text-label-bold text-heritage-gold uppercase mb-2">Email Address</label>
          <input 
            type="email" id="v-email" name="Email" required
            className="w-full bg-on-primary/10 border border-on-primary/20 text-on-primary placeholder:text-on-primary/50 px-4 py-3 rounded-lg focus:outline-none focus:border-heritage-gold transition-colors" 
            placeholder="jane@email.com"
          />
        </div>
        <div>
          <label htmlFor="v-phone" className="block font-label-bold text-label-bold text-heritage-gold uppercase mb-2">Phone (Optional)</label>
          <input 
            type="tel" id="v-phone" name="Phone"
            className="w-full bg-on-primary/10 border border-on-primary/20 text-on-primary placeholder:text-on-primary/50 px-4 py-3 rounded-lg focus:outline-none focus:border-heritage-gold transition-colors" 
            placeholder="(210) 555-0100"
          />
        </div>
        <div>
          <label className="block font-label-bold text-label-bold text-heritage-gold uppercase mb-3">How would you like to help?</label>
          <div className="flex flex-col gap-2">
            {['Door Knocking / Canvassing', 'Phone Banking', 'Host a Meet & Greet'].map(option => (
              <label key={option} className="flex items-center gap-3 text-inverse-on-surface opacity-90 cursor-pointer">
                <input type="checkbox" name={option} className="w-4 h-4 accent-heritage-gold" />
                <span className="font-body-md text-body-md">{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        {errorMsg && (
          <div className="bg-error/20 border border-error text-white p-3 rounded text-sm">
            {errorMsg}
          </div>
        )}

        <Button type="submit" variant="primary" className="mt-2 w-full justify-center" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Sign Up to Volunteer'}
        </Button>
      </form>
    </div>
  );
}
