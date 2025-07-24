import { ROUTE } from '@/enums/routes.enum'
import { useAuth } from '@/hooks/auth/use-auth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

/**
 * List of routes for which redirection should not occur
 * if the user is not authenticated.
 */
const REDIRECT_IGNORED_ROUTES: ROUTE[] = [
  // ROUTE.DELETE_ACCOUNT
  // ROUTE.CONTACTS
  // ROUTE.FORGOT_PASSWORD
  // ROUTE.RESET_PASSWORD
]

export const UnauthenticatedRoutesGuard = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  /**
   * Checks if the user is authenticated. If not,
   * redirects to the appropriate page.
   */
  if (isAuthenticated) {
    // Redirect to a specific URL based on rules, if necessary
    // if (anotherDirectUrlByRules) {
    //   return <Navigate to={anotherDirectUrlByRules} state={{ from: location }} replace />;
    // }

    // Redirects to the page the user tried to access before,
    // except for ignored routes
    const redirectTo = location.state?.from?.pathname || ROUTE.HOME

    if (!REDIRECT_IGNORED_ROUTES.includes(redirectTo)) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />
    }
  }

  // If the user is authenticated, render the child routes.
  return <Outlet />
}
