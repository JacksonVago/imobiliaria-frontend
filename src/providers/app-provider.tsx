import { queryClient } from '@/services/react-query/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundaryProvider } from './error-boundary-provider'
import { AuthProvider } from '@/contexts/auth.context'
import { Toaster } from '@/components/ui/toaster'

interface AppProviderProps {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorBoundaryProvider>{children}</ErrorBoundaryProvider>
        </AuthProvider>
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  )
}
