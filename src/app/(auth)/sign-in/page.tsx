import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import SigInForm from './sign-in-form'

export default function SignInPage() {
  return (
    <div
      className={cn(
        'flex min-h-screen items-center justify-center p-4 overflow-hidden relative',
        'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800',
        'transition-colors duration-300',
      )}
    >
      <SigInForm />
      <Toaster />
    </div>
  )
}
