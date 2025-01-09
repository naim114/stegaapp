import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import { activityLogSimplifyColumns } from '../../internals/data/gridData';
import { getLogsByUserEmail } from '../../model/log';
import { getCurrentUser } from '../../services/auth';
import CircularProgress from '@mui/material/CircularProgress';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function ActivityLog() {
    const [logs, setLogs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchLogs = async () => {
            try {
                const user = await getCurrentUser();
                console.log('Current user from log:', user);

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

    const downloadLogsPDF = () => {
        const doc = new jsPDF();

        // Get the current date for the PDF
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        // Add title and date to the PDF
        doc.text('DeStegAi Activity Log', 14, 10);
        doc.setFontSize(10);
        doc.text(`Generated on: ${formattedDate}`, 14, 16);

        // Add the table
        doc.autoTable({
            head: [['Activity', 'Date']],
            body: logs.map((log) => [
                log.activity,
                new Date(log.date).toLocaleString(), // Convert timestamp to readable format
            ]),
            startY: 20,
        });

        // Save the PDF
        doc.save('activity_log.pdf');
    };

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h4" variant="h4" sx={{ mb: 1 }}>
                Activity Log
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={downloadLogsPDF}
                sx={{ mb: 2 }}
            >
                Download as PDF
            </Button>
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
