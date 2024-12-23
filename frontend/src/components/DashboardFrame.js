import * as React from 'react';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from '../theme/customizations';
import AppNavbar from '../components/AppNavbar';
import Homepage from '../module/home/Homepage';
import HomeBreadcrumb from '../module/home/HomeBreadcrumb';
import Steganalysis from '../module/steganalysis/Steganalysis';
import Report from '../module/report/Report';
import AdminPanel from '../module/admin/AdminPanel';
import SteganalysisBreadcrumb from '../module/steganalysis/SteganalysisBreadcrumb';
import ReportBreadcrumb from '../module/report/ReportBreadcrumb';
import AdminPanelBreadcrumb from '../module/admin/AdminPanelBreadcrumb';
import ActivityLog from '../module/activity/ActivityLog';
import ActivityBreadcrumb from '../module/activity/ActivityLogBreadcrumb';
import Profile from '../module/profile/Profile';
import ProfileBreadcrumb from '../module/profile/ProfileBreadcrumb';
import { getCurrentUser } from '../services/auth';
import SecurityPage from '../module/security/Security';
import SecurityBreadcrumb from '../module/security/SecurityBreadcrumb';

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

const pages = [
    {
        name: 'home',
        screen: <Homepage />,
        breadcrumb: <HomeBreadcrumb />,
    },
    {
        name: 'steganalysis',
        screen: <Steganalysis />,
        breadcrumb: <SteganalysisBreadcrumb />,
    },
    {
        name: 'reporting',
        screen: <Report />,
        breadcrumb: <ReportBreadcrumb />,
    },
    {
        name: 'profile',
        screen: <Profile />,
        breadcrumb: <ProfileBreadcrumb />,
    },
    {
        name: 'security',
        screen: <SecurityPage />,
        breadcrumb: <SecurityBreadcrumb />,
    },
    {
        name: 'activity',
        screen: <ActivityLog />,
        breadcrumb: <ActivityBreadcrumb />,
    },
    {
        name: 'admin',
        screen: <AdminPanel />,
        breadcrumb: <AdminPanelBreadcrumb />,
    },
];

export default function DashboardFrame(props) {
    const [currentPage, setCurrentPage] = React.useState(pages[0]);
    const navigate = useNavigate();

    React.useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (!currentUser) {
                    // Redirect to '/' if no user is signed in
                    navigate('/');
                }
            } catch (error) {
                console.error('Error checking user:', error);
                navigate('/'); // Redirect on error
            }
        };

        checkUser();
    }, [navigate]);

    function _handlePage(pageName) {
        for (let index = 0; index < pages.length; index++) {
            const page = pages[index];

            if (page.name === pageName) {
                setCurrentPage(page);
            }
        }
    }

    return (
        <AppTheme {...props} themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <SideMenu
                    pageName={currentPage.name}
                    onClick={(pageName) => _handlePage(pageName)}
                />
                <AppNavbar
                    pageName={currentPage.name}
                    onClick={(pageName) => _handlePage(pageName)}
                />
                {/* Main content */}
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: theme.vars
                            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                            : alpha(theme.palette.background.default, 1),
                        overflow: 'auto',
                    })}
                >
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                            mx: 3,
                            pb: 5,
                            mt: { xs: 8, md: 0 },
                        }}
                    >
                        <Header breadcrumb={currentPage.breadcrumb} />
                        {currentPage.screen}
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
}
