import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://upenyszjsssoktbmtlgh.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZW55c3pqc3Nzb2t0Ym10bGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNzQ3NjQsImV4cCI6MjEwMTY1MDc2NH0.gdeyHTzUKUkMGBoDpdJm35ESqNnVl4Pbchaw6cv-Nbk'
  )
}
