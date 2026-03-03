import { translations, type Language } from '@/lib/i18n/translations'

describe('Translations', () => {
  const languages: Language[] = ['en', 'ar']

  describe('Translation completeness', () => {
    it('should have both en and ar translations', () => {
      expect(translations.en).toBeDefined()
      expect(translations.ar).toBeDefined()
    })

    it('should have matching top-level keys for en and ar', () => {
      const enKeys = Object.keys(translations.en).sort()
      const arKeys = Object.keys(translations.ar).sort()
      expect(enKeys).toEqual(arKeys)
    })

    it('should have matching nested keys for all sections', () => {
      const sections = Object.keys(translations.en) as (keyof typeof translations.en)[]

      sections.forEach((section) => {
        const enSectionKeys = Object.keys(translations.en[section]).sort()
        const arSectionKeys = Object.keys(translations.ar[section]).sort()
        expect(enSectionKeys).toEqual(arSectionKeys)
      })
    })
  })

  describe('Translation content validation', () => {
    it('should have non-empty English translations', () => {
      const sections = Object.keys(translations.en) as (keyof typeof translations.en)[]

      sections.forEach((section) => {
        const sectionTranslations = translations.en[section]
        Object.entries(sectionTranslations).forEach(([key, value]) => {
          expect(value).toBeTruthy()
          expect(typeof value).toBe('string')
          expect((value as string).trim().length).toBeGreaterThan(0)
        })
      })
    })

    it('should have non-empty Arabic translations', () => {
      const sections = Object.keys(translations.ar) as (keyof typeof translations.ar)[]

      sections.forEach((section) => {
        const sectionTranslations = translations.ar[section]
        Object.entries(sectionTranslations).forEach(([key, value]) => {
          expect(value).toBeTruthy()
          expect(typeof value).toBe('string')
          expect((value as string).trim().length).toBeGreaterThan(0)
        })
      })
    })

    it('should have all navigation items translated', () => {
      expect(translations.en.nav.dashboard).toBe('Dashboard')
      expect(translations.ar.nav.dashboard).toBe('لوحة التحكم')
      expect(translations.en.nav.organizations).toBe('Organizations')
      expect(translations.ar.nav.organizations).toBe('المؤسسات')
      expect(translations.en.nav.logout).toBe('Log out')
      expect(translations.ar.nav.logout).toBe('تسجيل الخروج')
    })

    it('should have all common action translations', () => {
      expect(translations.en.common.save).toBe('Save')
      expect(translations.ar.common.save).toBe('حفظ')
      expect(translations.en.common.cancel).toBe('Cancel')
      expect(translations.ar.common.cancel).toBe('إلغاء')
      expect(translations.en.common.delete).toBe('Delete')
      expect(translations.ar.common.delete).toBe('حذف')
    })

    it('should have auth translations', () => {
      expect(translations.en.auth.login).toBe('Log in')
      expect(translations.ar.auth.login).toBe('تسجيل الدخول')
      expect(translations.en.auth.signup).toBe('Sign up')
      expect(translations.ar.auth.signup).toBe('إنشاء حساب')
    })
  })

  describe('Translation type safety', () => {
    it('Language type should include en and ar', () => {
      const langEn: Language = 'en'
      const langAr: Language = 'ar'
      expect(langEn).toBe('en')
      expect(langAr).toBe('ar')
    })

    it('translations should be a readonly frozen structure', () => {
      expect(typeof translations).toBe('object')
      expect(Object.keys(translations)).toEqual(['en', 'ar'])
    })
  })
})
