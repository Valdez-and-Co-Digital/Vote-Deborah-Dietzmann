import { login } from './actions'
import Button from '@/components/Button'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/admin');
  }

  const resolvedParams = await searchParams;
  const errorMsg = resolvedParams.error;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest px-4">
      <div className="bg-neutral-white max-w-md w-full rounded-2xl p-8 shadow-xl border border-outline-variant">
        <div className="text-center mb-8">
          <h1 className="font-headline-lg text-primary mb-2">Campaign Admin</h1>
          <p className="font-body-md text-legal-gray">Sign in to access your dashboard</p>
        </div>
        
        <form className="flex flex-col gap-5">
          <div>
            <label className="block font-label-bold text-primary uppercase mb-2" htmlFor="email">Email:</label>
            <input 
              className="w-full bg-surface-container-low border border-outline text-on-surface px-4 py-3 rounded-lg focus:outline-none focus:border-secondary transition-colors" 
              id="email" 
              name="email" 
              type="email" 
              required 
            />
          </div>
          <div>
            <label className="block font-label-bold text-primary uppercase mb-2" htmlFor="password">Password:</label>
            <input 
              className="w-full bg-surface-container-low border border-outline text-on-surface px-4 py-3 rounded-lg focus:outline-none focus:border-secondary transition-colors" 
              id="password" 
              name="password" 
              type="password" 
              required 
            />
          </div>
          
          {errorMsg && (
            <div className="bg-error/10 border border-error text-error p-3 rounded text-sm text-center font-body-sm">
              {errorMsg}
            </div>
          )}

          <Button type="submit" formAction={login} variant="primary" className="w-full justify-center mt-2">
            Log In
          </Button>
        </form>
      </div>
    </div>
  )
}
