import { useAuth } from '@/hooks/auth/use-auth'
import { FrontendErrorReport } from '@/interfaces/frontend-error-report.interface'
import { ErrorBoundaryFallback } from '@/pages/errors/error-boundary-fallback'
import api from '@/services/axios/api'
import { getClientTimezone } from '@/utils/get-client-timezone'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useLocation } from 'react-router-dom'

interface IErrorBoundaryProviderProps {
  children: React.ReactNode
}

/*
 * Every app can have unexpected errors, like network issues, server errors, or bugs in the code.
 * React provides a way to handle these errors, called Error Boundaries.
 * Boundaries intercept error during render phase, lifecycle methods.
 * Boundaries NOT catch errors in event handlers, async code, server side rendering, errors thrown in the error boundary itself.
 * Boundaries are a way to handle errors in React components, avoiding crash on the whole app and showing a interface to user while we can log the error and send it to a server
 * We can just use boundary with class component
 * Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the whole app.
 */

export const ErrorBoundaryProvider = ({
  children
}: IErrorBoundaryProviderProps) => {
  const location = useLocation() // Move useLocation outside handleError

  const { mutateAsync } = useMutation({
    //retry infinite times
    retry: Infinity,
    //exponential from max of 1 minute
    retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 60000),
    mutationFn: async (data: FrontendErrorReport) => {
    return  await api.post('/frontend-error-report', data)
    }
  })

  const { user } = useAuth()

  const userId = user?.id

  const handleError = async (
    error: Error,
    { componentStack, digest }: React.ErrorInfo
  ) => {
    mutateAsync({
      timestamp: new Date().toISOString(),
      timezone: getClientTimezone(),
      //TODO: language, etc
      userId: userId,
      baseUrl: api.defaults?.baseURL,
      frontendRoute: location?.pathname,
      userAgent: navigator?.userAgent,
      viewportSize: `${window?.innerWidth} x ${window?.innerHeight}`,
      errorDetails: {
        componentStack,
        digest,
        error
      }
    })
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorBoundaryFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  )
}
