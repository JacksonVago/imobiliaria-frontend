export const cleanDocument = (document: string) => {
  return document.replace(/[^\d\-\.\s]/g, '')
}
