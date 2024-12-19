import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 800,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
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

export default function ScanHistoryModal({ open, onClose, scans }) {
    const [selectedScan, setSelectedScan] = useState(null);

    const handleViewDetails = (scan) => {
        setSelectedScan(scan);
    };

    const handleCloseDetails = () => {
        setSelectedScan(null);
    };

    const rows = scans?.map((scan, index) => ({
        id: index,
        prediction: scan.prediction,
        confidence: scan.confidence,
        date: new Date(scan.date).toLocaleString(),
        viewDetails: () => handleViewDetails(scan),
    })) || [];

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'grey.500',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Scan History
                </Typography>
                <CustomizedDataGrid columns={columns} rows={rows} />

                {selectedScan && (
                    <Modal open={!!selectedScan} onClose={handleCloseDetails}>
                        <Box sx={{ ...style, width: 400 }}>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseDetails}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    color: 'grey.500',
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6">Scan Details</Typography>
                            <Typography>Date: {new Date(selectedScan.date).toLocaleString()}</Typography>
                            <Typography>Prediction: {selectedScan.prediction}</Typography>
                            <Typography>Confidence: {selectedScan.confidence}</Typography>
                            <img
                                src={selectedScan.photoURL}
                                alt="Scan Result"
                                style={{ width: '100%', marginTop: '10px' }}
                            />
                        </Box>
                    </Modal>
                )}
            </Box>
        </Modal>
    );
}
