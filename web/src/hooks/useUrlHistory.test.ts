import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UrlResponse } from "../types";
import { renderHook, waitFor } from '@testing-library/react'
import { useUrlHistory } from "./useUrlHistory";

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('useUrlHistory hook', () => {
    beforeEach(() => vi.resetAllMocks())

    it('has initial state', () => {
        const { result } = renderHook(() => useUrlHistory())

        expect(result.current.isLoading).toBe(true)
        expect(result.current.error).toBe('')
    })

    it('should fetch data succesfully', async () => {
        const mockData: UrlResponse[] = [{
            originalUrl: "https://longMockedUrl42.fr",
            shortCode: "http://localhost:3000/ueh56d"
        }]
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        })

        const { result } = renderHook(() => useUrlHistory())

        expect(result.current.isLoading).toBe(true)
        expect(result.current.urls).toEqual([])
        expect(result.current.error).toBe("")

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.urls).toEqual(mockData)
        expect(result.current.error).toBe("")
        expect(mockFetch).toHaveBeenCalled()
    })

    it('should handle fetch error', async () => {
        const mockError = new Error("Network error")
        mockFetch.mockRejectedValueOnce(mockError)

        const { result } = renderHook(() => useUrlHistory())

        expect(result.current.isLoading).toBe(true)
        expect(result.current.urls).toEqual([])
        expect(result.current.error).toBe("")

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.urls).toEqual([])
        expect(result.current.error).toBe(mockError.message)

    })

    it('should delete url successfully', async () => {
        const { result } = renderHook(() => useUrlHistory())
        const url = "https://example.com/to/delete"

        mockFetch.mockResolvedValueOnce({ ok: true })

        await result.current.deleteUrl(url)

        expect(result.current.error).toBe("")
        expect(mockFetch)
            .toHaveBeenCalledWith(
                import.meta.env.VITE_API_URL + "url",
                expect.objectContaining({
                    method: "DELETE",
                    body: JSON.stringify({
                        originalUrl: url
                    })
                })
            )
        // TODO: We need to test fetchUrl reacll after succes delete url
    })

    it('should handle delete error', async () => {
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => { })
        const msg = "URL not found"

        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] }) // For the first fetchUrls useEffect

        mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: msg }) }) // for our test

        const { result } = renderHook(() => useUrlHistory())
        await result.current.deleteUrl("https://example.com/url")

        expect(alertSpy).toHaveBeenCalledWith(msg)
        alertSpy.mockRestore()
    })

    it('should handle delete empty url error', async () => {
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => { })

        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] }) // For the first fetchUrls useEffect

        const { result } = renderHook(() => useUrlHistory())
        await result.current.deleteUrl("")

        expect(alertSpy).toHaveBeenCalledWith("Url's missing")
        alertSpy.mockRestore()
    })

})