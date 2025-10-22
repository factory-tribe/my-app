/**
 * Normalizes a domain by removing port and 'www.' prefix if present.
 * This ensures consistent tenant lookups regardless of whether users access
 * the site via www.example.com or example.com
 * 
 * @param domain - The domain to normalize (e.g., 'www.example.com:3000')
 * @returns The normalized domain (e.g., 'example.com')
 * 
 * @example
 * normalizeDomain('www.shopengenie.com:3000') // returns 'shopengenie.com'
 * normalizeDomain('kasvi.shopengenie.com') // returns 'kasvi.shopengenie.com'
 * normalizeDomain('www.kasvi.shopengenie.com') // returns 'kasvi.shopengenie.com'
 */
export function normalizeDomain(domain: string): string {
  // Remove port if present
  let normalized = domain.split(':')[0]
  
  // Remove 'www.' prefix if present
  if (normalized.startsWith('www.')) {
    normalized = normalized.substring(4)
  }
  
  return normalized
}

