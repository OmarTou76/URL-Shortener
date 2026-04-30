import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Link,
    Button
} from '@mui/material';
import { Loader } from "./Loader";
import { useUrlHistory } from "../hooks/useUrlHistory";

export const ShortenedUrlHistory = () => {
    const { urls, deleteUrl, isLoading, error } = useUrlHistory();

    if (error) {
        return (
            <Box sx={{ p: 2, color: 'error.main' }}>
                <Typography>{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ py: 2 }}>
                <Typography variant="h5" component="h1">
                    Urls history
                </Typography>
            </Box>

            {isLoading && <Loader />}

            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid black' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Original URL</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Shortened URL</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {urls.map((url, id) => (
                            <TableRow key={id} hover>
                                <TableCell sx={{ maxWidth: 200, overflowWrap: 'break-word' }}>
                                    {url.originalUrl}
                                </TableCell>
                                <TableCell>
                                    <Link href={url.shortCode} target="_blank">{url.shortCode}</Link>
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => deleteUrl(url.originalUrl)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!isLoading && urls.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align='center'>
                                    <Typography>
                                        Empty history url
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};