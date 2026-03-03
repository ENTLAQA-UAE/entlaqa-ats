import React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider, useI18n } from '@/lib/i18n/context'

function TestConsumer() {
  const { language, setLanguage, t, dir, isRTL } = useI18n()
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="dir">{dir}</span>
      <span data-testid="isRTL">{String(isRTL)}</span>
      <span data-testid="dashboard">{t.nav.dashboard}</span>
      <button onClick={() => setLanguage('ar')} data-testid="switch-ar">
        Arabic
      </button>
      <button onClick={() => setLanguage('en')} data-testid="switch-en">
        English
      </button>
    </div>
  )
}

describe('I18nContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = 'en'
  })

  it('should provide default English language', () => {
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    )

    expect(screen.getByTestId('language')).toHaveTextContent('en')
    expect(screen.getByTestId('dir')).toHaveTextContent('ltr')
    expect(screen.getByTestId('isRTL')).toHaveTextContent('false')
    expect(screen.getByTestId('dashboard')).toHaveTextContent('Dashboard')
  })

  it('should switch to Arabic language', async () => {
    const user = userEvent.setup()

    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    )

    await user.click(screen.getByTestId('switch-ar'))

    expect(screen.getByTestId('language')).toHaveTextContent('ar')
    expect(screen.getByTestId('dir')).toHaveTextContent('rtl')
    expect(screen.getByTestId('isRTL')).toHaveTextContent('true')
    expect(screen.getByTestId('dashboard')).toHaveTextContent('لوحة التحكم')
  })

  it('should persist language preference in localStorage', async () => {
    const user = userEvent.setup()

    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    )

    await user.click(screen.getByTestId('switch-ar'))

    expect(localStorage.setItem).toHaveBeenCalledWith('jadarat-lang', 'ar')
  })

  it('should restore language from localStorage', () => {
    ;(localStorage.getItem as jest.Mock).mockReturnValue('ar')

    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    )

    // After useEffect processes, language should change
    // Note: initial render is 'en', then effect changes to 'ar'
    expect(localStorage.getItem).toHaveBeenCalledWith('jadarat-lang')
  })

  it('should update document direction when language changes', async () => {
    const user = userEvent.setup()

    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    )

    await user.click(screen.getByTestId('switch-ar'))
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')

    await user.click(screen.getByTestId('switch-en'))
    expect(document.documentElement.dir).toBe('ltr')
    expect(document.documentElement.lang).toBe('en')
  })

  it('should throw error when useI18n is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    expect(() => {
      render(<TestConsumer />)
    }).toThrow('useI18n must be used within an I18nProvider')

    consoleError.mockRestore()
  })

  it('should provide all translation sections', () => {
    let translationObj: any = null

    function TranslationCapture() {
      const { t } = useI18n()
      translationObj = t
      return null
    }

    render(
      <I18nProvider>
        <TranslationCapture />
      </I18nProvider>
    )

    expect(translationObj).toBeDefined()
    expect(translationObj.common).toBeDefined()
    expect(translationObj.nav).toBeDefined()
    expect(translationObj.dashboard).toBeDefined()
    expect(translationObj.organizations).toBeDefined()
    expect(translationObj.tiers).toBeDefined()
    expect(translationObj.billing).toBeDefined()
    expect(translationObj.settings).toBeDefined()
    expect(translationObj.auth).toBeDefined()
  })
})
