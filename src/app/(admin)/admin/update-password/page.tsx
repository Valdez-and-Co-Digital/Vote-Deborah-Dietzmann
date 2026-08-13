import { updatePassword } from './actions'
import Button from '@/components/Button'

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await searchParams;
  const errorMsg = resolvedParams.error;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest px-4">
      <div className="bg-neutral-white max-w-md w-full rounded-2xl p-8 shadow-xl border border-outline-variant">
        <div className="text-center mb-8">
          <h1 className="font-headline-lg text-primary mb-2">Welcome!</h1>
          <p className="font-body-md text-legal-gray">Please set a password for your new admin account.</p>
        </div>
        
        <form className="flex flex-col gap-5">
          <div>
            <label className="block font-label-bold text-primary uppercase mb-2" htmlFor="password">New Password:</label>
            <input 
              className="w-full bg-surface-container-low border border-outline text-on-surface px-4 py-3 rounded-lg focus:outline-none focus:border-secondary transition-colors" 
              id="password" 
              name="password" 
              type="password" 
              minLength={6}
              required 
            />
          </div>
          <div>
            <label className="block font-label-bold text-primary uppercase mb-2" htmlFor="confirmPassword">Confirm Password:</label>
            <input 
              className="w-full bg-surface-container-low border border-outline text-on-surface px-4 py-3 rounded-lg focus:outline-none focus:border-secondary transition-colors" 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              minLength={6}
              required 
            />
          </div>
          
          {errorMsg && (
            <div className="bg-error/10 border border-error text-error p-3 rounded text-sm text-center font-body-sm">
              {errorMsg}
            </div>
          )}

          <Button type="submit" formAction={updatePassword} variant="primary" className="w-full justify-center mt-2">
            Set Password & Continue
          </Button>
        </form>
      </div>
    </div>
  )
}
