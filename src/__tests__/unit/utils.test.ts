import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-4', 'py-2')
    expect(result).toBe('px-4 py-2')
  })

  it('should handle conditional class names', () => {
    const isActive = true
    const result = cn('base', isActive && 'active')
    expect(result).toContain('base')
    expect(result).toContain('active')
  })

  it('should handle falsy values', () => {
    const result = cn('base', false, null, undefined, '', 'extra')
    expect(result).toBe('base extra')
  })

  it('should merge tailwind classes correctly (last wins)', () => {
    const result = cn('px-4', 'px-6')
    expect(result).toBe('px-6')
  })

  it('should handle array inputs', () => {
    const result = cn(['px-4', 'py-2'])
    expect(result).toBe('px-4 py-2')
  })

  it('should handle object inputs', () => {
    const result = cn({ 'px-4': true, 'py-2': false, 'mt-4': true })
    expect(result).toBe('px-4 mt-4')
  })

  it('should return empty string for no arguments', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle complex tailwind merge scenarios', () => {
    const result = cn('text-red-500', 'text-blue-500')
    expect(result).toBe('text-blue-500')
  })

  it('should preserve non-conflicting classes', () => {
    const result = cn('bg-red-500', 'text-white', 'p-4')
    expect(result).toContain('bg-red-500')
    expect(result).toContain('text-white')
    expect(result).toContain('p-4')
  })
})
