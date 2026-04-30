import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UrlShortener } from './UrlShortener'

const mockCreateShortUrl = vi.fn()
let mockIsLoading = false
let mockError = ''

vi.mock('../hooks/useUrlShorter', () => ({
    useUrlShorter: () => ({
        createShortUrl: mockCreateShortUrl,
        isLoading: mockIsLoading,
        error: mockError,
    }),
}))

describe('UrlShortener', () => {
    beforeEach(() => {
        mockCreateShortUrl.mockReset()
        mockIsLoading = false
        mockError = ''
    })

    it('should render the input and the button', () => {
        render(<UrlShortener />)

        expect(screen.getByLabelText(/long url/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /shorten link/i })).toBeInTheDocument()
    })

    it('should disable the button when the input is empty', () => {
        render(<UrlShortener />)

        expect(screen.getByRole('button', { name: /shorten link/i })).toBeDisabled()
    })

    it('should call createShortUrl with the typed url when clicking the button', async () => {
        mockCreateShortUrl.mockResolvedValue('http://localhost:3000/ueh56d')

        render(<UrlShortener />)
        const user = userEvent.setup()

        await user.type(screen.getByLabelText(/long url/i), 'https://longMockedUrl42.fr')
        await user.click(screen.getByRole('button', { name: /shorten link/i }))

        expect(mockCreateShortUrl).toHaveBeenCalledWith('https://longMockedUrl42.fr')
    })

    it('should show "Shortening.." when loading', () => {
        mockIsLoading = true

        render(<UrlShortener />)

        expect(screen.getByRole('button')).toHaveTextContent(/shortening/i)
        expect(screen.getByRole('button')).toBeDisabled()
    })
})
