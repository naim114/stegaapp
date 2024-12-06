import React from 'react';
import Grid from '@mui/material/Grid2';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';

export const col = [
    { field: 'activity', headerName: 'Activity', flex: 1 }, // Auto size based on content with relative flexibility
    {
        field: 'date',
        headerName: 'Date',
        flex: 1, // Auto size based on content with relative flexibility
        renderCell: (params) => {
            const date = new Date(params.value);
            return date.toLocaleString(); // Formats date to local time
        },
    },
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%', // Adjust to a percentage for responsiveness
    maxWidth: 1000,
    maxHeight: '90vh', // Ensure the modal doesn't exceed viewport height
    overflowY: 'auto', // Enable scrolling for overflow
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2, // Optional: Add rounded corners for better aesthetics
};

export default function UserLogModal({ open, onClose, user, logs }) {
    // Render nothing if user is null
    if (!user) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="user-detail-title"
            aria-describedby="user-detail-description"
        >
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
                <Typography id="user-detail-title" variant="h6" sx={{ mb: 2 }}>
                    {user.name}'s Activity Log
                </Typography>
                <Grid container spacing={2} columns={6}>
                    <Grid size={{ xs: 12, lg: 9 }}>
                        <CustomizedDataGrid
                            columns={col}
                            rows={logs || []}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}
