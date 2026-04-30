import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShortenedUrlHistory } from './ShortenedUrlHistory'
import type { UrlResponse } from '../types'

const mockDeleteUrl = vi.fn()
let mockUrls: UrlResponse[] = []
let mockIsLoading = false
let mockError = ''

vi.mock('../hooks/useUrlHistory', () => ({
    useUrlHistory: () => ({
        urls: mockUrls,
        deleteUrl: mockDeleteUrl,
        isLoading: mockIsLoading,
        error: mockError,
    }),
}))

describe('ShortenedUrlHistory', () => {
    beforeEach(() => {
        mockDeleteUrl.mockReset()
        mockUrls = []
        mockIsLoading = false
        mockError = ''
    })

    it('should display the error message when there is an error', () => {
        mockError = 'Something went wrong'

        render(<ShortenedUrlHistory />)

        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('should display "Empty history url" when the list is empty and not loading', () => {
        render(<ShortenedUrlHistory />)

        expect(screen.getByText(/empty history url/i)).toBeInTheDocument()
    })

    it('should render a row for each url', () => {
        mockUrls = [
            { originalUrl: 'https://longMockedUrl42.fr', shortCode: 'http://localhost:3000/ueh56d' },
            { originalUrl: 'https://example.com/url', shortCode: 'http://localhost:3000/short42' },
        ]

        render(<ShortenedUrlHistory />)

        expect(screen.getByText('https://longMockedUrl42.fr')).toBeInTheDocument()
        expect(screen.getByText('https://example.com/url')).toBeInTheDocument()
    })

    it('should call deleteUrl with the original url when clicking Delete', async () => {
        mockUrls = [
            { originalUrl: 'https://longMockedUrl42.fr', shortCode: 'http://localhost:3000/ueh56d' },
        ]

        render(<ShortenedUrlHistory />)
        const user = userEvent.setup()

        await user.click(screen.getByRole('button', { name: /delete/i }))

        expect(mockDeleteUrl).toHaveBeenCalledWith('https://longMockedUrl42.fr')
    })
})
