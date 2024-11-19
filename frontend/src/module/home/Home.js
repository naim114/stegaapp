import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import DashboardFrame from "../../components/DashboardFrame";
import MainGrid from "../../components/MainGrid";
import NavbarBreadcrumbs from "../../";

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
      <MainGrid />
    </DashboardFrame>
  );
}
