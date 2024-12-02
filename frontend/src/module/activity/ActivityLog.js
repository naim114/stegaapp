import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import { activityLogSimplifyColumns } from '../../internals/data/gridData';
import { getLogsByUserEmail } from '../../model/log';
import { getCurrentUser } from '../../services/auth';
import CircularProgress from '@mui/material/CircularProgress';

export default function ActivityLog() {
    const [logs, setLogs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchLogs = async () => {
            try {
                const user = await getCurrentUser(); // Replace with your current user retrieval logic

                console.log("current user from log: " + user);

                if (user) {
                    const fetchedLogs = await getLogsByUserEmail(user.email); // Use the email field
                    const rows = fetchedLogs.map((log, index) => ({
                        id: index, // Use a unique identifier for the grid
                        activity: log.activity,
                        date: log.date, // Assuming Firestore Timestamp; convert to JS Date
                    }));
                    setLogs(rows);
                } else {
                    console.warn('No user signed in.');
                }
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h4" variant="h4" sx={{ mb: 1 }}>
                Activity Log
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2} columns={6}>
                    <Grid size={{ xs: 12, lg: 9 }}>
                        <CustomizedDataGrid columns={activityLogSimplifyColumns} rows={logs} />
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
