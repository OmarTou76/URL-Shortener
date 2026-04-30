import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useUrlShorter } from './useUrlShorter'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('useUrlShorter', () => {
    beforeEach(() => vi.resetAllMocks())

    it('has initial state', () => {
        const { result } = renderHook(() => useUrlShorter())

        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBe('')
    })

    it('creates short url successfully', async () => {
        const url = "https://longMockedUrl42.fr"
        mockFetch.mockResolvedValueOnce(
            {
                ok: true, json: async () => ({ shortCode: 'short42' })
            }
        )

        const { result } = renderHook(() => useUrlShorter())

        const shortCode = await result.current.createShortUrl(url)
        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(shortCode).toBe('short42')
        expect(result.current.error).toBe('')
        expect(mockFetch).toHaveBeenCalledWith(
            import.meta.env.VITE_API_URL + 'url',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ originalUrl: url }),
            })
        )
    })

    it('handles network error', async () => {
        const error = new Error('Network error')
        mockFetch.mockRejectedValueOnce(error)

        const { result } = renderHook(() => useUrlShorter())

        const shortCode = await result.current.createShortUrl('https://example.com')
        await waitFor(() => expect(result.current.isLoading).toBe(false))
        await waitFor(() => expect(result.current.error).toBe(error.message))

        expect(shortCode).toBe('')
    })

    it("alerts when url is empty", async () => {
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { })

        const { result } = renderHook(() => useUrlShorter())
        const shortCode = await result.current.createShortUrl('')

        expect(shortCode).toBe('')
        expect(alertSpy).toHaveBeenCalledWith("Long url's missing")
        expect(mockFetch).not.toHaveBeenCalled()

        alertSpy.mockRestore()
    })
})
