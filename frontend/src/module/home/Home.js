import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import DashboardFrame from "../../components/DashboardFrame";
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Copyright from '../../internals/components/Copyright';
import ChartUserByCountry from '../../components/ChartUserByCountry';
import CustomizedTreeView from '../../components/CustomizedTreeView';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import HighlightedCard from '../../components/HighlightedCard';
import PageViewsBarChart from '../../components/PageViewsBarChart';
import SessionsChart from '../../components/SessionsChart';
import StatCard from '../../components/StatCard';


const data = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
      520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

export default function Home() {
  const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
      color: (theme.vars || theme).palette.action.disabled,
      margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
      alignItems: 'center',
    },
  }));

  const navbar =
    (
      <StyledBreadcrumbs
        aria- label="breadcrumb"
        separator={< NavigateNextRoundedIcon fontSize="small" />}
      >
        <Typography variant="body1">Dashboard</Typography>
        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
          Home
        </Typography>
      </StyledBreadcrumbs >
    )


  return (
    <DashboardFrame breadcrumb={navbar}>
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
            <CustomizedDataGrid />
          </Grid>
        </Grid>
        <Copyright sx={{ my: 4 }} />
      </Box>
    </DashboardFrame>
  );
}
