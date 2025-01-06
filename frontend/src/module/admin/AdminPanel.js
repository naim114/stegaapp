import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import ActivityChart from '../../components/ActivityChart';
import { activityLogColumns } from '../../internals/data/gridData';
import { getAllLogs, getLogsByUserEmail } from '../../model/log';
import { getAllUsers } from '../../model/user';
import { getScanResultsByUser } from '../../model/scan';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Avatar from '@mui/material/Avatar';
import UserDetailModal from './UserDetailModal';
import UserLogModal from './UserLoglModal';
import ScanHistoryModal from './ScanHistoryModal'; // New modal for scan history
import ActivityBarChart from '../../components/ActivityBarChart';


export default function AdminPanel() {
    const [userRows, setUserRows] = useState([]);
    const [activityLogRows, setActivityLogRows] = useState([]);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isActivityLogLoading, setIsActivityLogLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserLog, setSelectedUserLog] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isUserLogModalOpen, setIsUserLogModalOpen] = useState(false);
    const [isScanHistoryModalOpen, setIsScanHistoryModalOpen] = useState(false);
    const [scanHistory, setScanHistory] = useState([]);

    const handleOpenUserModal = (user) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };

    const handleCloseUserModal = () => {
        setSelectedUser(null);
        setIsUserModalOpen(false);
    };

    const handleOpenUserLogModal = async (user) => {
        setSelectedUser(user);
        setIsUserLogModalOpen(true);

        if (user) {
            const fetchedLogs = await getLogsByUserEmail(user.email);
            const rows = fetchedLogs.map((log, index) => ({
                id: index,
                activity: log.activity,
                date: log.date,
            }));
            setSelectedUserLog(rows);
        }
    };

    const handleCloseUserLogModal = () => {
        setSelectedUser(null);
        setSelectedUserLog([]);
        setIsUserLogModalOpen(false);
    };

    const handleOpenScanHistoryModal = async (user) => {
        setSelectedUser(user);
        setIsScanHistoryModalOpen(true);

        if (user) {
            const fetchedScanHistory = await getScanResultsByUser(user.email);
            const rows = fetchedScanHistory.map((scan, index) => ({
                id: index,
                prediction: scan.prediction,
                confidence: scan.confidence,
                photoURL: scan.photoURL,
                date: new Date(scan.date).toLocaleString(),
            }));
            setScanHistory(rows);
        }
    };

    const handleCloseScanHistoryModal = () => {
        setSelectedUser(null);
        setScanHistory([]);
        setIsScanHistoryModalOpen(false);
    };

    const userColumns = [
        {
            field: 'avatar',
            headerName: 'Avatar',
            width: 100,
            renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <Avatar
                        sizes="small"
                        alt={params.row.name}
                        src={params.row.avatar}
                        sx={{ width: 36, height: 36 }}
                    />
                </div>
            ),
        },
        { field: 'name', headerName: 'Name', flex: 1.5, minWidth: 150 },
        { field: 'email', headerName: 'Email', flex: 2, minWidth: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 2,
            minWidth: 300,
            sortable: false,
            renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenUserLogModal(params.row)}
                        sx={{ marginRight: 1 }}
                    >
                        Activity Log
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleOpenUserModal(params.row)}
                        sx={{ marginRight: 1 }}
                    >
                        Profile
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => handleOpenScanHistoryModal(params.row)}
                        sx={{ marginRight: 1 }}
                    >
                        Scan History
                    </Button>
                </>
            ),
        },
    ];

    // Fetch user data
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getAllUsers();

                const formattedUsers = users.map((user, index) => ({
                    id: index + 1,
                    avatar: user.photoURL || '',
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
                                avatar = matchedUser.photoURL || '';
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

    // Generate PDF for User List
    const downloadUserListPDF = () => {
        const doc = new jsPDF();

        // Get the current date
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        // Add title and date to the PDF
        doc.text('User List', 14, 10);
        doc.setFontSize(10);
        doc.text(`Generated on: ${formattedDate}`, 14, 16);

        // Add the table
        doc.autoTable({
            head: [['Name', 'Email', 'Scans']],
            body: userRows.map((row) => [row.name, row.email, row.scansPerUser]),
            startY: 20,
        });

        // Save the PDF
        doc.save('user_list.pdf');
    };

    // Generate PDF for Activity Log
    const downloadActivityLogPDF = () => {
        const doc = new jsPDF();

        // Get the current date
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        doc.text('Activity Log', 14, 10);
        doc.setFontSize(10);
        doc.text(`Generated on: ${formattedDate}`, 14, 16);

        doc.autoTable({
            head: [['Activity', 'Date']],
            body: activityLogRows.map((row) => [row.activity, row.date]),
            startY: 20,
        });
        doc.save('activity_log.pdf');
    };

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
                    <ActivityChart />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <ActivityBarChart />
                </Grid>
            </Grid>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                User List
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={downloadUserListPDF}
            >
                Download User List as PDF
            </Button>
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

            {/* Activity Log Section */}
            <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 2 }}>
                Activity Log
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={downloadActivityLogPDF}
            >
                Download Activity Log as PDF
            </Button>
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
            <UserDetailModal
                open={isUserModalOpen}
                onClose={handleCloseUserModal}
                user={selectedUser}
            />
            <UserLogModal
                open={isUserLogModalOpen}
                onClose={handleCloseUserLogModal}
                user={selectedUser}
                logs={selectedUserLog}
            />
            <ScanHistoryModal
                open={isScanHistoryModalOpen}
                onClose={handleCloseScanHistoryModal}
                user={selectedUser}
                scans={scanHistory}
            />
        </Box>
    );
}
