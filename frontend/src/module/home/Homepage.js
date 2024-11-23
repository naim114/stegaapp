import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Copyright from '../../internals/components/Copyright';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import PageViewsBarChart from '../../components/PageViewsBarChart';
import SessionsChart from '../../components/SessionsChart';
import { columns, rows } from '../../internals/data/gridData';

export default function Home() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h2" sx={{ mb: 2 }}>
        Welcome to stegoapp
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
        Details
      </Typography>
      <Grid container spacing={2} columns={6}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid columns={columns} rows={rows} />
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
