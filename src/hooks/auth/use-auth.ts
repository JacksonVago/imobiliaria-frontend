import { AuthContext } from '@/contexts/auth.context'
import { createContext, useContext } from 'react'

/*
 * Custom hook to access the auth context data
 */

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


/*
 * Auth context type
 */
export type AuthContextType = {
  isAuthenticated: boolean
  isLoadingUserData: boolean
  login: () => void
  logout: () => void
}
export const authContext = createContext<AuthContextType | undefined>(undefined)


