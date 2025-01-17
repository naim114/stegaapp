import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import ColorModeSelect from '../../shared-theme/ColorModeSelect';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { signUp, getCurrentUser } from '../../services/auth';
import { Snackbar, CircularProgress } from '@mui/material';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function SignUp(props) {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [isSnackbarShow, setIsSnackbarShow] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const navigate = useNavigate();

    React.useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    console.log('Authenticated user found:', currentUser.displayInfo());
                    navigate('/dashboard');
                }
            } catch (error) {
                console.log('No authenticated user:', error.message);
            }
        };

        checkUser();
    }, [navigate]);

    const validateInputs = () => {
        let isValid = true;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{7,}$/;
        if (!password || !passwordRegex.test(password)) {
            setPasswordError(true);
            setPasswordErrorMessage(
                'Password must be more than 6 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
            );
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!name || name.length < 1) {
            setNameError(true);
            setNameErrorMessage('Name is required.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, name);
            console.log('User signed up successfully!');
            setSnackbarMsg("Sign up success! Please login first to continue.");
            setIsSnackbarShow(true);

            setName('');
            setEmail('');
            setPassword('');

            navigate('/');
        } catch (err) {
            console.log('Error signing up: ' + err.message);

            if (err.message.includes('email-already-in-use')) {
                setSnackbarMsg("Email already exists. Please try a different email.");
            } else {
                setSnackbarMsg(err.message);
            }

            setIsSnackbarShow(true);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (event) => {
        const sanitizedValue = event.target.value.replace(/[;'"/\\$]/g, '');
        setEmail(sanitizedValue);
    };

    const handlePasswordChange = (event) => {
        const sanitizedValue = event.target.value.replace(/[;'"/\\$]/g, '');
        setPassword(sanitizedValue);
    };

    const handleNameChange = (event) => {
        const sanitizedValue = event.target.value.replace(/[;'"/\\$]/g, '');
        setName(sanitizedValue);
    };


    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Sign up
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">Full name</FormLabel>
                            <TextField
                                autoComplete="name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                placeholder="Jon Snow"
                                value={name}
                                onChange={handleNameChange}
                                error={nameError}
                                helperText={nameErrorMessage}
                                color={nameError ? 'error' : 'primary'}
                                disabled={loading}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                placeholder="your@email.com"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                value={email}
                                onChange={handleEmailChange}
                                error={emailError}
                                helperText={emailErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                                disabled={loading}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                variant="outlined"
                                value={password}
                                onChange={handlePasswordChange}
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                                disabled={loading}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Sign up'}
                        </Button>
                    </Box>
                    <Divider>
                        <Typography sx={{ color: 'text.secondary' }}>or</Typography>
                    </Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography sx={{ textAlign: 'center' }}>
                            Already have an account?{' '}
                            <Link
                                href="/material-ui/getting-started/templates/sign-in/"
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                            >
                                <RouterLink to="/">
                                    Sign in
                                </RouterLink>
                            </Link>
                        </Typography>
                    </Box>
                </Card>

                <Snackbar
                    open={isSnackbarShow}
                    autoHideDuration={6000}
                    onClose={() => setIsSnackbarShow(false)}
                    message={snackbarMsg}
                />
            </SignUpContainer>
        </AppTheme>
    );
}
