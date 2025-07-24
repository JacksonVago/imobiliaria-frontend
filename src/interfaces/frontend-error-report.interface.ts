export interface FrontendErrorReport {
  timestamp: string
  timezone: string
  userId?: string
  baseUrl?: string
  frontendRoute: string
  userAgent: string
  //TODO: implement more fields, language, viewportSize, deviceType, appVersion, metadata etc
  viewportSize?: string //width x height
  deviceType?: string //mobile, tablet, desktop
  appVersion?: string
  errorDetails: {
    componentStack?: string | null
    digest?: string | null
    error: Error
  }
}
