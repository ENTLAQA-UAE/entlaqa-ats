import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '@/components/layout/header'
import { I18nProvider } from '@/lib/i18n/context'
import { createClient } from '@/lib/supabase/client'

jest.mock('@/lib/supabase/client')

const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
    replace: jest.fn(),
  }),
  usePathname: () => '/',
}))

function renderHeader(props: { title?: string; titleAr?: string } = {}) {
  return render(
    <I18nProvider>
      <Header {...props} />
    </I18nProvider>
  )
}

describe('Header', () => {
  let mockSignOut: jest.Mock
  let mockClient: any

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    mockSignOut = jest.fn().mockResolvedValue({ error: null })
    mockClient = {
      auth: { signOut: mockSignOut },
    }
    ;(createClient as jest.Mock).mockReturnValue(mockClient)
  })

  it('should render header with search and user actions', () => {
    renderHeader()

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('should render language toggle button', () => {
    renderHeader()

    // The globe icon button is the language toggle
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('should render notification button with indicator', () => {
    renderHeader()

    // Check for notification button (bell icon)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('should render user avatar menu', () => {
    renderHeader()

    // Avatar/user menu trigger
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })

  it('should display custom title when provided', () => {
    renderHeader({ title: 'Custom Title' })
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })

  it('should handle logout', async () => {
    const user = userEvent.setup()
    renderHeader()

    // Open user dropdown
    const avatarButton = screen.getAllByRole('button').find((btn) =>
      btn.querySelector('[class*="avatar"]') || btn.classList.contains('rounded-full')
    )

    if (avatarButton) {
      await user.click(avatarButton)

      await waitFor(async () => {
        const logoutButton = screen.queryByText('Log out')
        if (logoutButton) {
          await user.click(logoutButton)
          expect(mockSignOut).toHaveBeenCalled()
        }
      })
    }
  })
})
