import React, { useState, useEffect } from 'react';
import { Box, Avatar, Stack, TextField, Button, CircularProgress, Typography, Snackbar } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';
import { getCurrentUser } from '../../services/auth';
import { updateUser, uploadAvatar } from '../../model/user';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [isSnackbarShow, setIsSnackbarShow] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const user = await getCurrentUser();
                setUserId(user?.uid || '');
                setName(user?.name || '');
                setEmail(user?.email || '');
                setAvatar(user?.photoURL || '/static/images/avatar/default.jpg');
            } catch (error) {
                console.error('Error fetching user:', error.message);
                setSnackbarMsg('Failed to fetch user details.');
                setIsSnackbarShow(true);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const sanitizeInput = (input) => {
        return input.replace(/[<>$;"/\\]/g, '');
    };

    const handleNameChange = (event) => {
        setName(sanitizeInput(event.target.value));
    };

    const handleEmailChange = (event) => {
        setEmail(sanitizeInput(event.target.value));
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                setLoading(true);
                const newAvatarURL = await uploadAvatar(userId, file); // Upload avatar
                setAvatar(newAvatarURL); // Update state with new avatar URL
                setSnackbarMsg('Profile picture updated successfully!');
                setIsSnackbarShow(true);

                navigate('/');
            } catch (error) {
                console.error('Error updating profile picture:', error.message);
                setSnackbarMsg('Failed to update profile picture. Please try again.');
                setIsSnackbarShow(true);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            const updatedData = { name, email };
            await updateUser(userId, updatedData);
            setSnackbarMsg('Profile updated successfully!');
            setIsSnackbarShow(true);

            navigate('/');
        } catch (error) {
            console.error('Error updating profile:', error.message);
            setSnackbarMsg('Failed to update profile. Please try again.');
            setIsSnackbarShow(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
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
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h4" variant="h4" sx={{ mb: 2 }}>
                Profile
            </Typography>
            <Stack direction="row" spacing={4} sx={{ marginBottom: 4 }}>
                <Avatar
                    alt={name}
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
                        disabled
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
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateProfile}
                disabled={loading}
            >
                Update Profile
            </Button>

            <Snackbar
                open={isSnackbarShow}
                autoHideDuration={6000}
                onClose={() => setIsSnackbarShow(false)}
                message={snackbarMsg}
            />
        </Box>
    );
};

export default ProfilePage;
