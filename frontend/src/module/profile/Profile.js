import React, { useState, useEffect } from 'react';
import { Box, Avatar, Stack, TextField, Button, CircularProgress, Typography } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';
import { getCurrentUser } from '../../services/auth'; // Adjust path as needed

const ProfilePage = () => {
    // State for name, email, avatar, and loading
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch current user data on component mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true); // Start loading
                const user = await getCurrentUser();
                setName(user?.name || '');
                setEmail(user?.email || '');
                setAvatar(user?.photoURL || '/static/images/avatar/default.jpg');
            } catch (error) {
                console.error('Error fetching user:', error.message);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchUser();
    }, []);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', padding: 2 }}>
                <Typography component="h4" variant="h4" sx={{ mb: 2 }}>
                    Profile
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        flexDirection: 'column',
                    }}
                >
                    <CircularProgress />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Typography component="h4" variant="h4" sx={{ mb: 2 }}>
                Profile
            </Typography>
            {/* Profile Section */}
            <Stack direction="row" spacing={4} sx={{ marginBottom: 4 }}>
                <Avatar
                    alt="User Avatar"
                    src={avatar}
                    sx={{ width: 100, height: 100 }}
                />
                <Stack spacing={1} sx={{ flex: 1 }}>
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={handleEmailChange}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                </Stack>
                <Button
                    variant="contained"
                    component="label"
                    sx={{ height: 100 }}
                >
                    <CameraAlt />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        hidden
                    />
                </Button>
            </Stack>
        </Box>
    );
};

export default ProfilePage;
