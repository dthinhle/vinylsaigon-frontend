import { API_URL } from '@/lib/constants'
import { camelizeKeys } from 'humps'

export const fetchRedirections = async () => {
  const res = await fetch(API_URL + '/api/redirection_mappings', {
    next: { tags: ['redirections'], revalidate: 86400 }, // Revalidate every 24 hours
  })
  if (!res.ok) {
    throw new Error('Failed to fetch redirections')
  }

  return camelizeKeys(await res.json()) as {
    redirections: Array<{ oldSlug: string; newSlug: string }>
  }
}
