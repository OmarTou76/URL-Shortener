import { useCallback, useState } from "react"
import type { UrlResponse } from "../types"

export const useUrlShorter = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const createShortUrl = useCallback(async (url: string): Promise<string> => {
        if (!url) {
            alert("Long url's missing")
            return ""
        }
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "url", {
                method: "POST",
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
            const data: UrlResponse = await response.json()
            return data.shortCode
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Unknown error")
            return ""
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { createShortUrl, isLoading, error }
}