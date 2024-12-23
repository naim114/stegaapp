import React from 'react';
import { Modal, Box, Typography, Avatar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

export default function UserDetailModal({ open, onClose, user }) {
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
                    User Details
                </Typography>
                {user ? (
                    <>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Avatar
                                alt={user.name}
                                src={user.avatar}
                                sx={{ width: 60, height: 60, marginRight: 2 }}
                            />
                            <Typography variant="h6">{user.name}</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Email:</strong> {user.email}
                        </Typography>
                    </>
                ) : (
                    <Typography variant="body1">No user data available.</Typography>
                )}
            </Box>
        </Modal>
    );
}
