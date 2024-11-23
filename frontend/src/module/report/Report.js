import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid2 } from '@mui/material';

import CustomizedDataGrid from '../../components/CustomizedDataGrid';

export default function Report() {
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h4" variant="h4" sx={{ mb: 1 }}>
                Report
            </Typography>

            <Grid2 container spacing={2} columns={6}>
                <Grid2 size={{ xs: 12, lg: 9 }}>
                    <CustomizedDataGrid />
                </Grid2>
            </Grid2>
        </Box>
    );
}