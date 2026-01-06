import { afterEach, describe, expect, it, mock } from 'bun:test'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'

import { Modal } from '@/components/modal'

const mockRouterBack = mock()

mock.module('next/navigation', () => ({
  useRouter: () => ({
    back: mockRouterBack,
  }),
}))

describe('Modal', () => {
  afterEach(cleanup)

  it('renders the title and children', () => {
    const title = 'Test Modal'
    const children = <div>Test Content</div>
    render(<Modal title={title}>{children}</Modal>)

    expect(screen.getByText(title)).not.toBeNull()
    expect(screen.getByText('Test Content')).not.toBeNull()
  })

  it('calls router.back() when close button is clicked', () => {
    render(<Modal title='Test Modal'>Test Content</Modal>)

    fireEvent.click(screen.getByRole('button'))

    expect(mockRouterBack).toHaveBeenCalled()
  })

  it('applies overflow:hidden to body on mount', () => {
    render(<Modal title='Test Modal'>Test Content</Modal>)

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('removes overflow:hidden from body on unmount', () => {
    const { unmount } = render(<Modal title='Test Modal'>Test Content</Modal>)

    unmount()

    expect(document.body.style.overflow).toBe('unset')
  })
})
