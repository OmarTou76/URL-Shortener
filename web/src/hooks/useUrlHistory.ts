import { useCallback, useEffect, useState } from "react"
import type { UrlResponse } from "../types"

export const useUrlHistory = () => {
    const [urls, setUrls] = useState<UrlResponse[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")


    const fetchUrls = useCallback(async (): Promise<void> => {
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "url")
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const data: UrlResponse[] = await response.json()
            setUrls(data)
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Unknown error")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUrls()
    }, [fetchUrls])

    const deleteUrl = useCallback(async (url: string): Promise<void> => {
        if (!url) {
            return alert("Url's missing")
        }

        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "url", {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    originalUrl: url
                })
            })
            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                throw new Error(data.message || response.statusText)
            }
            await fetchUrls()
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : "Unknown error was occured during deleting url: " + url)
        }
    }, [fetchUrls])
    return {
        urls,
        isLoading,
        error,
        deleteUrl
    }
}