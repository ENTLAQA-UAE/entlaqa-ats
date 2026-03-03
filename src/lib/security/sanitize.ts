/**
 * Input sanitization and validation utilities.
 */

/**
 * Sanitize a value for safe CSV export.
 * Prevents CSV formula injection (=, @, +, - prefixed values).
 */
export function sanitizeCsvValue(value: string): string {
  const dangerous = ['=', '@', '+', '-']
  let sanitized = value.replace(/"/g, '""')
  if (dangerous.includes(sanitized.charAt(0))) {
    sanitized = `'${sanitized}`
  }
  return sanitized
}

/**
 * Enforce a maximum length on a string input, truncating if exceeded.
 */
export function enforceMaxLength(value: string, maxLength: number): string {
  return value.slice(0, maxLength)
}

/**
 * Validate a redirect path is safe (relative, no open redirect).
 */
export function isValidRedirectPath(path: string): boolean {
  if (!path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (path.toLowerCase().startsWith('/\\')) return false
  try {
    const decoded = decodeURIComponent(path)
    if (decoded.startsWith('//')) return false
  } catch {
    return false
  }
  return true
}

/**
 * Strip HTML tags from a string (defense-in-depth for display values).
 */
export function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

/**
 * Generate a URL-safe slug from a name, stripping all unsafe characters.
 */
export function generateSafeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
