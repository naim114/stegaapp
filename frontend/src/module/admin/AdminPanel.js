import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import SessionsChart from '../../components/SessionsChart';
import PageViewsBarChart from '../../components/PageViewsBarChart';
import { activityLogColumns, userColumns } from '../../internals/data/gridData';
import { getAllLogs } from '../../model/log';
import { getAllUsers } from '../../model/user';

export default function AdminPanel() {
    const [userRows, setUserRows] = useState([]);
    const [activityLogRows, setActivityLogRows] = useState([]);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isActivityLogLoading, setIsActivityLogLoading] = useState(true);

    // Fetch user data
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getAllUsers();
                const formattedUsers = users.map((user, index) => ({
                    id: index + 1,
                    avatar: user.avatar || '',
                    name: user.name,
                    email: user.email,
                    scansPerUser: user.scansPerUser || 0,
                }));
                setUserRows(formattedUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsUserLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Fetch activity logs
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const logs = await getAllLogs();
                const formattedLogs = await Promise.all(
                    logs.map(async (log, index) => {
                        let name = log.from;
                        let avatar = '';

                        try {
                            const users = await getAllUsers();
                            const matchedUser = users.find((u) => u.email === log.from);
                            if (matchedUser) {
                                name = matchedUser.name;
                                avatar = matchedUser.avatar || '';
                            }
                        } catch {
                            console.warn(`User details not found for: ${log.from}`);
                        }

                        return {
                            id: index + 1,
                            name,
                            avatar,
                            activity: log.activity,
                            date: log.date,
                        };
                    })
                );
                setActivityLogRows(formattedLogs);
            } catch (error) {
                console.error('Error fetching activity logs:', error);
            } finally {
                setIsActivityLogLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h4" variant="h4" sx={{ mb: 2 }}>
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
                    {isUserLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <CustomizedDataGrid columns={userColumns} rows={userRows} />
                    )}
                </Grid>
            </Grid>
            <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 2 }}>
                Activity Log
            </Typography>
            <Grid container spacing={2} columns={6}>
                <Grid size={{ xs: 12, lg: 9 }}>
                    {isActivityLogLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <CustomizedDataGrid columns={activityLogColumns} rows={activityLogRows} />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
