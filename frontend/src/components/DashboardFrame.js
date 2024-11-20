import * as React from 'react';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
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
import Homepage from '../module/home/Homepage'
import HomeBreadcrumb from '../module/home/HomeBreadcrumb';
import Steganalysis from '../module/steganalysis/Steganalysis';
import Report from '../module/report/Report';
import AdminPanel from '../module/admin/AdminPanel';

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
        breadcrumb: <HomeBreadcrumb />,
    },
    {
        name: 'reporting',
        screen: <Report />,
        breadcrumb: <HomeBreadcrumb />,

    }, {
        name: 'admin',
        screen: <AdminPanel />,
        breadcrumb: <HomeBreadcrumb />,
    },
];



export default function DashboardFrame(props) {
    const [currentPage, setCurrentPage] = React.useState(pages[0]);

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
                <AppNavbar />
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
