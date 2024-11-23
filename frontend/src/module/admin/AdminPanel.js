import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Copyright from '../../internals/components/Copyright';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import SessionsChart from '../../components/SessionsChart';
import PageViewsBarChart from '../../components/PageViewsBarChart';
import { userColumns, userRows, activityLogColumns, activityLogRows } from '../../internals/data/gridData';

export default function AdminPanel() {
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            {/* cards */}
            <Typography component="h4" variant="h4" sx={{ mb: 1 }}>
                Admin Panel
            </Typography>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{ mb: (theme) => theme.spacing(2) }}
            >
                <Grid size={{ xs: 12, md: 6 }}>
                    <SessionsChart />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <PageViewsBarChart />
                </Grid>
            </Grid>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                User List
            </Typography>
            <Grid container spacing={2} columns={6}>
                <Grid size={{ xs: 12, lg: 9 }}>
                    <CustomizedDataGrid columns={userColumns} rows={userRows} />
                </Grid>
            </Grid>
            <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 2 }}>
                Activity Log
            </Typography>
            <Grid container spacing={2} columns={6}>
                <Grid size={{ xs: 12, lg: 9 }}>
                    <CustomizedDataGrid columns={activityLogColumns} rows={activityLogRows} />
                </Grid>
            </Grid>
            <Copyright sx={{ my: 4 }} />
        </Box>
    );
}