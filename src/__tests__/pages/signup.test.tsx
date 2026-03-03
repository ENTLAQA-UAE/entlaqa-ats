import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupPage from '@/app/(auth)/signup/page'
import { createClient } from '@/lib/supabase/client'

jest.mock('@/lib/supabase/client')

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/signup',
  useSearchParams: () => new URLSearchParams(),
}))

describe('SignupPage', () => {
  let mockSignUp: jest.Mock
  let mockClient: any

  beforeEach(() => {
    jest.clearAllMocks()
    mockSignUp = jest.fn()
    mockClient = {
      auth: {
        signUp: mockSignUp,
      },
    }
    ;(createClient as jest.Mock).mockReturnValue(mockClient)
  })

  it('should render signup form', () => {
    render(<SignupPage />)

    expect(screen.getByText('Create an Account')).toBeInTheDocument()
    expect(screen.getByText('Get started with Jadarat ATS')).toBeInTheDocument()
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('should have link to login page', () => {
    render(<SignupPage />)

    const loginLink = screen.getByText('Sign in')
    expect(loginLink).toBeInTheDocument()
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
  })

  it('should have required fields', () => {
    render(<SignupPage />)

    expect(screen.getByLabelText('First Name')).toHaveAttribute('required')
    expect(screen.getByLabelText('Last Name')).toHaveAttribute('required')
    expect(screen.getByLabelText('Email')).toHaveAttribute('required')
    expect(screen.getByLabelText('Password')).toHaveAttribute('required')
  })

  it('should enforce minimum password length', () => {
    render(<SignupPage />)
    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('minLength', '8')
  })

  it('should enforce maximum input lengths', () => {
    render(<SignupPage />)
    expect(screen.getByLabelText('First Name')).toHaveAttribute('maxLength', '50')
    expect(screen.getByLabelText('Last Name')).toHaveAttribute('maxLength', '50')
    expect(screen.getByLabelText('Email')).toHaveAttribute('maxLength', '254')
    expect(screen.getByLabelText('Password')).toHaveAttribute('maxLength', '128')
  })

  it('should reject weak passwords client-side', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)

    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Password'), 'weakpass')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      const { toast } = require('sonner')
      expect(toast.error).toHaveBeenCalled()
      // Should NOT call Supabase signUp because password is invalid
      expect(mockSignUp).not.toHaveBeenCalled()
    })
  })

  it('should show password strength indicator', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)

    await user.type(screen.getByLabelText('Password'), 'Test1@secure')

    await waitFor(() => {
      expect(screen.getByText(/strength:/i)).toBeInTheDocument()
    })
  })

  it('should allow filling in all fields', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)

    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Password'), 'Secure1@pass')

    expect(screen.getByLabelText('First Name')).toHaveValue('John')
    expect(screen.getByLabelText('Last Name')).toHaveValue('Doe')
    expect(screen.getByLabelText('Email')).toHaveValue('john@example.com')
    expect(screen.getByLabelText('Password')).toHaveValue('Secure1@pass')
  })

  it('should call Supabase signUp with correct data', async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValue({ data: {}, error: null })

    render(<SignupPage />)

    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Password'), 'Secure1@pass')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'Secure1@pass',
        options: {
          data: {
            first_name: 'John',
            last_name: 'Doe',
          },
        },
      })
    })
  })

  it('should redirect to login on successful signup', async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValue({ data: {}, error: null })

    render(<SignupPage />)

    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Password'), 'Secure1@pass')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('should show error on signup failure', async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValue({
      data: {},
      error: { message: 'User already registered' },
    })

    render(<SignupPage />)

    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.type(screen.getByLabelText('Email'), 'existing@example.com')
    await user.type(screen.getByLabelText('Password'), 'Secure1@pass')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      const { toast } = require('sonner')
      expect(toast.error).toHaveBeenCalledWith('User already registered')
    })
  })

  it('should handle network errors', async () => {
    const user = userEvent.setup()
    mockSignUp.mockRejectedValue(new Error('Network error'))

    render(<SignupPage />)

    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Password'), 'Secure1@pass')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      const { toast } = require('sonner')
      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred')
    })
  })

  it('should disable form during loading', async () => {
    const user = userEvent.setup()
    let resolveSignUp: (value: any) => void
    mockSignUp.mockReturnValue(
      new Promise((resolve) => {
        resolveSignUp = resolve
      })
    )

    render(<SignupPage />)

    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Password'), 'Secure1@pass')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toBeDisabled()
      expect(screen.getByLabelText('Password')).toBeDisabled()
    })

    resolveSignUp!({ data: {}, error: null })
  })
})
