import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import { activityLogColumns, activityLogRows } from '../../internals/data/gridData';

export default function ActivityLog() {
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            {/* cards */}
            <Typography component="h4" variant="h4" sx={{ mb: 1 }}>
                Activity Log
            </Typography>
            <Grid container spacing={2} columns={6}>
                <Grid size={{ xs: 12, lg: 9 }}>
                    <CustomizedDataGrid columns={activityLogColumns} rows={activityLogRows} />
                </Grid>
            </Grid>
        </Box>
    );
}