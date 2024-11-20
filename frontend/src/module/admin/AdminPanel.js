import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function AdminPanel() {
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h2" variant="h3" sx={{ mb: 2 }}>
                Admin Panel
            </Typography>
        </Box>
    );
}