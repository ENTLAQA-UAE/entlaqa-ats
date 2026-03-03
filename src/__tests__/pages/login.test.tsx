import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/(auth)/login/page'
import { createClient } from '@/lib/supabase/client'

// Re-mock to get access to mock functions
jest.mock('@/lib/supabase/client')

const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/login',
  useSearchParams: () => new URLSearchParams(),
}))

describe('LoginPage', () => {
  let mockSignIn: jest.Mock
  let mockClient: any

  beforeEach(() => {
    jest.clearAllMocks()
    mockSignIn = jest.fn()
    mockClient = {
      auth: {
        signInWithPassword: mockSignIn,
      },
    }
    ;(createClient as jest.Mock).mockReturnValue(mockClient)
  })

  it('should render login form', () => {
    render(<LoginPage />)

    expect(screen.getByText('Welcome to Jadarat')).toBeInTheDocument()
    expect(screen.getByText('AI-Powered Applicant Tracking System')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should have link to signup page', () => {
    render(<LoginPage />)

    const signupLink = screen.getByText('Sign up')
    expect(signupLink).toBeInTheDocument()
    expect(signupLink.closest('a')).toHaveAttribute('href', '/signup')
  })

  it('should have required email and password fields', () => {
    render(<LoginPage />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')

    expect(emailInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('required')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should allow user to type email and password', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('should call Supabase signIn on form submission', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ data: {}, error: null })

    render(<LoginPage />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should redirect to dashboard on successful login', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ data: {}, error: null })

    render(<LoginPage />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'validpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('should show error message on failed login', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({
      data: {},
      error: { message: 'Invalid login credentials' },
    })

    render(<LoginPage />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      const { toast } = require('sonner')
      expect(toast.error).toHaveBeenCalledWith('Invalid login credentials')
    })
  })

  it('should disable inputs while loading', async () => {
    const user = userEvent.setup()
    // Create a promise that we control
    let resolveSignIn: (value: any) => void
    mockSignIn.mockReturnValue(
      new Promise((resolve) => {
        resolveSignIn = resolve
      })
    )

    render(<LoginPage />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toBeDisabled()
      expect(screen.getByLabelText('Password')).toBeDisabled()
    })

    // Resolve the promise to clean up
    resolveSignIn!({ data: {}, error: null })
  })

  it('should handle unexpected errors gracefully', async () => {
    const user = userEvent.setup()
    mockSignIn.mockRejectedValue(new Error('Network error'))

    render(<LoginPage />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      const { toast } = require('sonner')
      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred')
    })
  })

  it('should show loading spinner during submission', async () => {
    const user = userEvent.setup()
    let resolveSignIn: (value: any) => void
    mockSignIn.mockReturnValue(
      new Promise((resolve) => {
        resolveSignIn = resolve
      })
    )

    render(<LoginPage />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled()
    })

    resolveSignIn!({ data: {}, error: null })
  })
})
