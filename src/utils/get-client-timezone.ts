export const getClientTimezone = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return timezone
}
