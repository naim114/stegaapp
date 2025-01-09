import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import { getCurrentUser } from '../../services/auth';
import { getScanResultsByUser } from '../../model/scan';
import Modal from '@mui/material/Modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const columns = [
    { field: 'prediction', headerName: 'Prediction', flex: 1 },
    { field: 'confidence', headerName: 'Confidence (%)', flex: 1 },
    { field: 'date', headerName: 'Date', flex: 1 },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        renderCell: (params) => (
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => params.row.viewDetails()}
            >
                View More
            </Button>
        ),
    },
];

export default function Report() {
    const [rows, setRows] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [selectedResult, setSelectedResult] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                setUserEmail(user?.email || '');
            } catch (error) {
                console.error('Error fetching user:', error.message);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (!userEmail) return;
            setLoading(true);
            try {
                const results = await getScanResultsByUser(userEmail);
                const formattedRows = results.map((result, index) => ({
                    id: index,
                    prediction: result.prediction,
                    confidence: result.confidence,
                    date: new Date(result.date).toLocaleString(),
                    viewDetails: () => {
                        setSelectedResult(result);
                        setModalOpen(true);
                    },
                }));
                setRows(formattedRows);
            } catch (error) {
                console.error('Error fetching scan results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [userEmail]);

    const handleClose = () => {
        setModalOpen(false);
        setSelectedResult(null);
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Get the current date
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const tableColumn = ['Prediction', 'Confidence (%)', 'Date'];
        const tableRows = rows.map((row) => [
            row.prediction,
            row.confidence,
            row.date,
        ]);

        doc.text('DeStegAi Scan History Report', 14, 10);
        doc.setFontSize(10);
        doc.text(`Generated on: ${formattedDate}`, 14, 16);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });
        doc.save(userEmail + '-scan-history.pdf');
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography component="h4" variant="h4" sx={{ mb: 1 }}>
                Scan History
            </Typography>

            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '200px',
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={generatePDF}
                        sx={{ mb: 2 }}
                    >
                        Download PDF
                    </Button>
                    <CustomizedDataGrid columns={columns} rows={rows} />
                </>
            )}

            <Modal open={modalOpen} onClose={handleClose}>
                <Box sx={style}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'grey.500',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedResult && (
                        <>
                            <Typography variant="h6">Scan Details</Typography>
                            <Typography>
                                Date: {new Date(selectedResult.date).toLocaleString()}
                            </Typography>
                            <Typography>Prediction: {selectedResult.prediction}</Typography>
                            <Typography>Confidence: {selectedResult.confidence}</Typography>
                            <img
                                src={selectedResult.photoURL}
                                alt="Scan Result"
                                style={{ width: '100%', marginTop: '10px' }}
                            />
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
