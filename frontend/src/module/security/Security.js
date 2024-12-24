import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Stack, Snackbar } from '@mui/material';
import { getCurrentUser, forgotPassword, resendVerificationEmail, updateEmailAddress, logout } from '../../services/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const SecurityPage = () => {
    const [email, setEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [isSnackbarShow, setIsSnackbarShow] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const user = await getCurrentUser();
                setEmail(user?.email || '');
                setIsVerified(auth.currentUser?.emailVerified || false);
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

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleEmailChange = async () => {
        try {
            if (!newEmail || !password) {
                setSnackbarMsg('Please enter all required fields.');
                setIsSnackbarShow(true);
                return;
            }

            if (!newEmail) {
                setSnackbarMsg('Please enter a new email address.');
                setIsSnackbarShow(true);
                return;
            }

            if (!isValidEmail(newEmail)) {
                setSnackbarMsg('Please enter a valid email address.');
                setIsSnackbarShow(true);
                return;
            }

            setLoading(true);
            await updateEmailAddress(newEmail, password);
            setEmail(newEmail);
            setNewEmail('');
            setSnackbarMsg('Email address updated successfully! Please log out and login again with new email.');
            setIsSnackbarShow(true);
        } catch (error) {
            if (error.message.includes('wrong-password')) {
                setSnackbarMsg('Wrong password. Please try again.');
                setIsSnackbarShow(true);
            } else {
                setSnackbarMsg('Failed to update email address. Please try again.');
                setIsSnackbarShow(true);
            }

            console.error('Error updating email:', error.message);

        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        try {
            setLoading(true);
            await forgotPassword(email);
            setSnackbarMsg(`Password reset email sent to: ${email}`);
            setIsSnackbarShow(true);
        } catch (error) {
            console.error('Error resetting password:', error.message);
            setSnackbarMsg('Failed to send password reset email. Please try again.');
            setIsSnackbarShow(true);
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        try {
            setLoading(true);
            await resendVerificationEmail();
            setSnackbarMsg('Verification email sent successfully! Please log out and login back after email verification complete.');
            setIsSnackbarShow(true);
        } catch (error) {
            console.error('Error resending verification email:', error.message);
            setSnackbarMsg('Failed to resend verification email. Please try again.');
            setIsSnackbarShow(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Security
            </Typography>
            <Stack spacing={2} sx={{ mb: 4 }}>
                <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 2 }}>
                    Email Verification
                </Typography>
                <Typography component="p">
                    Email Address: <strong>{email}</strong>
                </Typography>
                <Typography component="p" color={isVerified ? 'green' : 'red'}>
                    {isVerified ? 'Your email is verified.' : 'Your email is not verified.'}
                </Typography>
                {!isVerified && (
                    <Button variant="contained" color="primary" onClick={handleResendVerification}>
                        Send Verification Email
                    </Button>
                )}
            </Stack>

            <Stack spacing={2} sx={{ mb: 4 }}>
                <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 2 }}>
                    Update Email
                </Typography>
                <TextField
                    label="New Email Address"
                    variant="outlined"
                    type='email'
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Current Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEmailChange}
                >
                    Update Email Address
                </Button>
            </Stack>

            <Stack spacing={2} sx={{ mb: 4 }}>
                <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 2 }}>
                    Reset Password
                </Typography>
                <Button variant="contained" color="secondary" onClick={handlePasswordReset}>
                    Reset Password
                </Button>
            </Stack>

            <Snackbar
                open={isSnackbarShow}
                autoHideDuration={6000}
                onClose={() => setIsSnackbarShow(false)}
                message={snackbarMsg}
            />
        </Box>
    );
};

export default SecurityPage;
