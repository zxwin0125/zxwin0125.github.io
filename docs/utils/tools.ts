export const createLink = (base: string, path: string): string => {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
