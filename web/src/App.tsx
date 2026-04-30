import { useState } from "react"
import { UrlShortener } from "./components/UrlShortener"
import { ShortenedUrlHistory } from "./components/ShortenedUrlHistory"
import { Box, Tabs, Tab, Paper } from "@mui/material"



function App() {
	const [tabIndex, setTabIndex] = useState(0)

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setTabIndex(newValue)
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				p: 2
			}}
		>
			<Paper elevation={3} sx={{ width: '100%', maxWidth: 720, overflow: 'hidden' }}>

				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs
						value={tabIndex}
						onChange={handleChange}
						variant="fullWidth"
						aria-label="URL Shortener tabs"
					>
						<Tab label="Shorten a Link" />
						<Tab label="History" />
					</Tabs>
				</Box>

				<Box sx={{ p: 3 }}>
					{tabIndex === 0 && (
						<UrlShortener />
					)}
					{tabIndex === 1 && (
						<ShortenedUrlHistory />
					)}
				</Box>

			</Paper>
		</Box>
	)
}

export default App
