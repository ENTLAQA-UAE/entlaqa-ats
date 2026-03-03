import {
  sanitizeCsvValue,
  enforceMaxLength,
  isValidRedirectPath,
  stripHtmlTags,
  generateSafeSlug,
} from '@/lib/security/sanitize'

describe('Sanitization Utilities', () => {
  describe('sanitizeCsvValue', () => {
    it('should pass through safe values unchanged', () => {
      expect(sanitizeCsvValue('John Doe')).toBe('John Doe')
      expect(sanitizeCsvValue('test@email.com')).toBe('test@email.com')
      expect(sanitizeCsvValue('Active')).toBe('Active')
    })

    it('should prefix values starting with = with single quote', () => {
      // Quotes are escaped to "" first, then the ' prefix is prepended
      expect(sanitizeCsvValue('=cmd')).toBe("'=cmd")
    })

    it('should prefix values starting with @ with single quote', () => {
      expect(sanitizeCsvValue('@SUM(1+1)')).toBe("'@SUM(1+1)")
    })

    it('should prefix values starting with + with single quote', () => {
      expect(sanitizeCsvValue('+cmd')).toBe("'+cmd")
    })

    it('should prefix values starting with - with single quote', () => {
      expect(sanitizeCsvValue('-cmd')).toBe("'-cmd")
    })

    it('should escape double quotes', () => {
      expect(sanitizeCsvValue('He said "hello"')).toBe('He said ""hello""')
    })

    it('should handle empty string', () => {
      expect(sanitizeCsvValue('')).toBe('')
    })
  })

  describe('enforceMaxLength', () => {
    it('should not truncate short strings', () => {
      expect(enforceMaxLength('hello', 100)).toBe('hello')
    })

    it('should truncate strings exceeding max length', () => {
      expect(enforceMaxLength('hello world', 5)).toBe('hello')
    })

    it('should handle empty string', () => {
      expect(enforceMaxLength('', 10)).toBe('')
    })

    it('should handle exact length', () => {
      expect(enforceMaxLength('hello', 5)).toBe('hello')
    })
  })

  describe('isValidRedirectPath', () => {
    it('should accept valid relative paths', () => {
      expect(isValidRedirectPath('/')).toBe(true)
      expect(isValidRedirectPath('/organizations')).toBe(true)
      expect(isValidRedirectPath('/users?page=1')).toBe(true)
      expect(isValidRedirectPath('/settings#security')).toBe(true)
    })

    it('should reject absolute URLs', () => {
      expect(isValidRedirectPath('https://evil.com')).toBe(false)
      expect(isValidRedirectPath('http://evil.com')).toBe(false)
    })

    it('should reject protocol-relative URLs', () => {
      expect(isValidRedirectPath('//evil.com')).toBe(false)
    })

    it('should reject backslash-based redirects', () => {
      expect(isValidRedirectPath('/\\evil.com')).toBe(false)
    })

    it('should reject javascript: URIs', () => {
      expect(isValidRedirectPath('javascript:alert(1)')).toBe(false)
    })

    it('should reject data: URIs', () => {
      expect(isValidRedirectPath('data:text/html,<script>')).toBe(false)
    })

    it('should reject encoded double-slash redirects', () => {
      expect(isValidRedirectPath('/%2F%2Fevil.com')).toBe(false)
    })

    it('should handle malformed URIs gracefully', () => {
      expect(isValidRedirectPath('/%ZZ')).toBe(false)
    })

    it('should reject empty string', () => {
      expect(isValidRedirectPath('')).toBe(false)
    })
  })

  describe('stripHtmlTags', () => {
    it('should remove simple HTML tags', () => {
      expect(stripHtmlTags('<b>bold</b>')).toBe('bold')
    })

    it('should remove script tags', () => {
      expect(stripHtmlTags('<script>alert(1)</script>')).toBe('alert(1)')
    })

    it('should remove nested tags', () => {
      expect(stripHtmlTags('<div><span>text</span></div>')).toBe('text')
    })

    it('should handle strings without tags', () => {
      expect(stripHtmlTags('plain text')).toBe('plain text')
    })

    it('should handle empty string', () => {
      expect(stripHtmlTags('')).toBe('')
    })

    it('should remove self-closing tags', () => {
      expect(stripHtmlTags('before<br/>after')).toBe('beforeafter')
    })

    it('should remove tags with attributes', () => {
      expect(stripHtmlTags('<a href="evil.com">click</a>')).toBe('click')
    })
  })

  describe('generateSafeSlug', () => {
    it('should convert to lowercase', () => {
      expect(generateSafeSlug('My Company')).toBe('my-company')
    })

    it('should replace spaces with hyphens', () => {
      expect(generateSafeSlug('hello world')).toBe('hello-world')
    })

    it('should strip special characters', () => {
      expect(generateSafeSlug('Test & Co.')).toBe('test-co')
      expect(generateSafeSlug("O'Malley")).toBe('o-malley')
    })

    it('should strip HTML tags', () => {
      expect(generateSafeSlug('<script>XSS</script>')).toBe('script-xss-script')
    })

    it('should strip leading/trailing hyphens', () => {
      expect(generateSafeSlug('  spaces  ')).toBe('spaces')
      expect(generateSafeSlug('---test---')).toBe('test')
    })

    it('should only contain alphanumeric and hyphens', () => {
      const slug = generateSafeSlug('Any! @#$% Complex^&* Name!!!')
      expect(slug).toMatch(/^[a-z0-9-]*$/)
    })

    it('should handle Arabic names (stripped to empty)', () => {
      expect(generateSafeSlug('شركة عربية')).toBe('')
    })
  })
})
