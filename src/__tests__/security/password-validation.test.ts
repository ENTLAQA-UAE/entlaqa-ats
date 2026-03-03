import { validatePassword, getPasswordStrength } from '@/lib/security/password-validation'

describe('Password Validation', () => {
  describe('validatePassword', () => {
    it('should accept a strong password', () => {
      const result = validatePassword('SecureP@ss1')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject a password shorter than 8 characters', () => {
      const result = validatePassword('Ab1!xyz')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters')
    })

    it('should reject a password longer than 128 characters', () => {
      const long = 'Aa1!' + 'x'.repeat(130)
      const result = validatePassword(long)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must be at most 128 characters')
    })

    it('should reject a password without uppercase', () => {
      const result = validatePassword('lowercase1!')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one uppercase letter')
    })

    it('should reject a password without lowercase', () => {
      const result = validatePassword('UPPERCASE1!')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one lowercase letter')
    })

    it('should reject a password without numbers', () => {
      const result = validatePassword('NoNumbers!')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one number')
    })

    it('should reject a password without special characters', () => {
      const result = validatePassword('NoSpecial1')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one special character')
    })

    it('should return multiple errors for a very weak password', () => {
      const result = validatePassword('abc')
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })

    it('should accept password with unicode special characters', () => {
      const result = validatePassword('SecureP1§')
      expect(result.valid).toBe(true)
    })

    it('should accept password with common special chars', () => {
      const specials = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+']
      specials.forEach((char) => {
        const password = `Testpass1${char}`
        const result = validatePassword(password)
        expect(result.valid).toBe(true)
      })
    })

    it('should reject an empty string', () => {
      const result = validatePassword('')
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should reject a password of only spaces', () => {
      const result = validatePassword('        ')
      expect(result.valid).toBe(false)
    })
  })

  describe('getPasswordStrength', () => {
    it('should rate "123" as weak', () => {
      expect(getPasswordStrength('123')).toBe('weak')
    })

    it('should rate "password" as weak', () => {
      expect(getPasswordStrength('password')).toBe('weak')
    })

    it('should rate "Password1" as fair', () => {
      const strength = getPasswordStrength('Password1')
      expect(['fair', 'good']).toContain(strength)
    })

    it('should rate "P@ssword1" as good', () => {
      const strength = getPasswordStrength('P@ssword1')
      expect(['good', 'strong']).toContain(strength)
    })

    it('should rate "V3ry$ecure!Pass" as strong', () => {
      const strength = getPasswordStrength('V3ry$ecure!Pass')
      expect(strength).toBe('strong')
    })

    it('should return one of the valid strength values', () => {
      const validStrengths = ['weak', 'fair', 'good', 'strong']
      const strength = getPasswordStrength('test')
      expect(validStrengths).toContain(strength)
    })

    it('should increase strength with length', () => {
      const short = getPasswordStrength('Aa1!')
      const long = getPasswordStrength('Aa1!Aa1!Aa1!Aa1!Aa1!')

      const strengthOrder = ['weak', 'fair', 'good', 'strong']
      expect(strengthOrder.indexOf(long)).toBeGreaterThanOrEqual(strengthOrder.indexOf(short))
    })
  })
})
