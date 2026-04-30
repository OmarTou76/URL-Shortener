import { useState } from "react"
import { useUrlShorter } from "../hooks/useUrlShorter"
import { Alert, Box, Button, Link, Stack, TextField, Typography } from "@mui/material"

export const UrlShortener = () => {
    const [url, setUrl] = useState<string>("")
    const [urlShorten, setUrlShorten] = useState<string>("")
    const { createShortUrl, isLoading, error } = useUrlShorter()

    const handleSubmit = async () => {
        if (!url) alert("url's missing")
        const shortUrl = await createShortUrl(url)
        setUrlShorten(shortUrl)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Stack spacing={3}>
                <TextField
                    fullWidth
                    label="Long URL"
                    id="url"
                    variant="outlined"
                    placeholder="https://seconde.app/"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                    slotProps={{
                        inputLabel: { shrink: true }
                    }}
                />
                {error && (
                    <Alert severity="error" variant="filled">
                        {error}
                    </Alert>
                )}

                {urlShorten && !isLoading && !error && (
                    <Alert severity="success">
                        <Typography variant="subtitle2">Short URL created:</Typography>
                        <Link
                            href={urlShorten}
                            target="_blank"
                            rel="noopener"
                            sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
                        >
                            {urlShorten}
                        </Link>
                    </Alert>
                )}

                <Button
                    fullWidth
                    size='large'
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!url || isLoading}
                    sx={{
                        height: '56px',
                        textTransform: 'none',
                        fontSize: '1rem'
                    }}
                >
                    {isLoading ? "Shortening.." : "Shorten Link"}
                </Button>
            </Stack>
        </Box>
    )
}