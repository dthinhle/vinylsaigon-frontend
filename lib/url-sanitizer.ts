/**
 * URLSanitizer provides methods to sanitize and validate URLs
 * for sitemap generation, preventing double slashes and null values
 */

// Sanitizes a path by removing leading slashes and handling null/empty values
export function sanitizePath(path: string | null | undefined): string {
  if (!path) {
    return ''
  }

  // Convert to string and remove leading slash
  let sanitized = path.toString().replace(/^\//, '')

  // Remove double slashes and normalize
  sanitized = sanitized.replace(/\/+/g, '/')

 return sanitized
}

// Validates if a path is suitable for sitemap inclusion
export function isValidPath(path: string | null | undefined): boolean {
  if (!path) {
    return false
  }

  const sanitized = sanitizePath(path)

  // Path should not be empty after sanitization
 if (!sanitized) {
    return false
  }

  // Path should not contain invalid patterns
  const invalidPatterns = [
    /^\./,           // starts with dot
    /\/\.\.\//,      // contains ../
    /\/\.\//,        // contains ./
    /\/$/,           // ends with slash (except for root)
    /\/{2,}/,        // contains double slashes
    /%00/,           // null byte
    /<|>/,           // contains HTML tags
  ]

  return !invalidPatterns.some(pattern => sanitized.match(pattern))
}

// Sanitizes and validates a path in one operation
export function processPath(path: string | null | undefined): string | null {
  const sanitized = sanitizePath(path)
  return isValidPath(sanitized) ? sanitized : null
}

// Builds a safe URL by combining base URL with a path
export function buildSafeUrl(baseUrl: string, path: string | null | undefined): string | null {
  const processedPath = processPath(path)

  if (!processedPath) {
    return null
  }

  // Ensure baseUrl doesn't end with a slash and path doesn't start with one
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '')
  const normalizedPath = processedPath.replace(/^\//, '')

  return `${normalizedBaseUrl}/${normalizedPath}`
}