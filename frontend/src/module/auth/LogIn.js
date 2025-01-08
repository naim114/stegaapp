import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Link from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import ColorModeSelect from '../../shared-theme/ColorModeSelect';
import { signIn, getCurrentUser } from '../../services/auth';
import { CircularProgress, Snackbar } from '@mui/material';
import Logo from '../../assets/logo-nobg.png';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const LogInContainer = styled(Stack)(({ theme }) => ({
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

export default function LogIn(props) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [isSnackbarShow, setIsSnackbarShow] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Check for current user on initial render
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          console.log("current user: " + user);

          navigate('/dashboard');
        }
      } catch (error) {
        console.log('No user currently signed in:', error.message);
      }
    };

    checkCurrentUser();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);

    setLoading(true);

    try {
      const user = await signIn(data.get('email'), data.get('password'));
      console.log('User signed in successfully!', user);

      setSnackbarMsg('Signed in successfully. Welcome!');
      setIsSnackbarShow(true);

      navigate('/dashboard');
    } catch (err) {
      if (err.message.includes('auth/invalid-credential') || err.message.includes('auth/user-not-found')) {
        setSnackbarMsg('Invalid credential. Please try again.');
      } else {
        setSnackbarMsg('There is something wrong logging in. Please try again.');
      }

      setIsSnackbarShow(true);
      console.log('Error signing in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <LogInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src={Logo}
              alt="DeStegAi"
              sx={{
                display: 'block',
                maxWidth: '80px',
                maxHeight: '80px',
              }}
            />
            <Typography variant="h6" align="center">
              DeStegAi
            </Typography>
          </Box>

          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                disabled={loading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
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
              {loading ? <CircularProgress size={24} /> : 'Log In'}
            </Button>
          </Box>
          <Typography sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link variant="body2" sx={{ alignSelf: 'center' }}>
              <RouterLink to="/sign-up">Sign up</RouterLink>
            </Link>
          </Typography>
          <Typography sx={{ textAlign: 'center' }}>
            <Link variant="body2" sx={{ alignSelf: 'center' }}>
              <RouterLink to="/pwd">Forgot your password?</RouterLink>
            </Link>
          </Typography>
        </Card>

        <Snackbar
          open={isSnackbarShow}
          autoHideDuration={6000}
          onClose={() => setIsSnackbarShow(false)}
          message={snackbarMsg}
        />
      </LogInContainer>
    </AppTheme>
  );
}
