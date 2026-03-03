import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '@/components/layout/sidebar'
import { I18nProvider } from '@/lib/i18n/context'

// Wrap component with I18nProvider for tests
function renderSidebar(props: { collapsed?: boolean; onCollapse?: (c: boolean) => void }) {
  return render(
    <I18nProvider>
      <Sidebar {...props} />
    </I18nProvider>
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render sidebar with navigation links', () => {
    renderSidebar({})

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Organizations')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Subscription Tiers')).toBeInTheDocument()
    expect(screen.getByText('Billing & Payments')).toBeInTheDocument()
    expect(screen.getByText('Email Templates')).toBeInTheDocument()
    expect(screen.getByText('Audit Logs')).toBeInTheDocument()
    expect(screen.getByText('Platform Settings')).toBeInTheDocument()
  })

  it('should render brand name when expanded', () => {
    renderSidebar({ collapsed: false })
    expect(screen.getByText('Jadarat')).toBeInTheDocument()
  })

  it('should hide labels when collapsed', () => {
    renderSidebar({ collapsed: true })
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('Organizations')).not.toBeInTheDocument()
  })

  it('should have correct navigation hrefs', () => {
    renderSidebar({})

    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).toHaveAttribute('href', '/')

    const orgsLink = screen.getByText('Organizations').closest('a')
    expect(orgsLink).toHaveAttribute('href', '/organizations')

    const usersLink = screen.getByText('Users').closest('a')
    expect(usersLink).toHaveAttribute('href', '/users')

    const tiersLink = screen.getByText('Subscription Tiers').closest('a')
    expect(tiersLink).toHaveAttribute('href', '/tiers')

    const settingsLink = screen.getByText('Platform Settings').closest('a')
    expect(settingsLink).toHaveAttribute('href', '/settings')
  })

  it('should call onCollapse when collapse button is clicked', async () => {
    const user = userEvent.setup()
    const onCollapse = jest.fn()
    renderSidebar({ collapsed: false, onCollapse })

    // The collapse button should be visible
    const buttons = screen.getAllByRole('button')
    const collapseButton = buttons[0] // First button is collapse
    await user.click(collapseButton)

    expect(onCollapse).toHaveBeenCalledWith(true)
  })

  it('should show expand button when collapsed', async () => {
    const user = userEvent.setup()
    const onCollapse = jest.fn()
    renderSidebar({ collapsed: true, onCollapse })

    const expandButton = screen.getByRole('button')
    await user.click(expandButton)

    expect(onCollapse).toHaveBeenCalledWith(false)
  })

  it('should apply active styles to current route', () => {
    // usePathname is mocked to return '/'
    renderSidebar({})

    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).toHaveClass('bg-primary')
  })
})
