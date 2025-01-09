import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import MuiCard from '@mui/material/Card';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import ColorModeSelect from '../../shared-theme/ColorModeSelect';
import { forgotPassword } from '../../services/auth';

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

const ForgotPasswordContainer = styled(Box)(({ theme }) => ({
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

export default function ForgotPassword(props) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [isSnackbarShow, setIsSnackbarShow] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Sanitize email input to remove unwanted characters
    const sanitizedEmail = email.replace(/[;'"/\\$]/g, '');

    if (!sanitizedEmail || !/\S+@\S+\.\S+/.test(sanitizedEmail)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      return;
    }

    setEmailError(false);
    setEmailErrorMessage('');
    setLoading(true);

    try {
      await forgotPassword(sanitizedEmail);
      setSnackbarMsg('Password reset email sent. Check your inbox.');
      setIsSnackbarShow(true);
    } catch (err) {
      setSnackbarMsg(err.message);
      setIsSnackbarShow(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event) => {
    const sanitizedValue = event.target.value.replace(/[;'"/\\$]/g, '');
    setEmail(sanitizedValue);
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ForgotPasswordContainer>
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Forgot Password
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
                value={email}
                onChange={handleEmailChange} // Sanitization is here
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </Box>
          <Typography sx={{ textAlign: 'center' }}>
            Remember your password?{' '}
            <Link variant="body2" sx={{ alignSelf: 'center' }}>
              <RouterLink to="/">Log In</RouterLink>
            </Link>
          </Typography>
        </Card>

        <Snackbar
          open={isSnackbarShow}
          autoHideDuration={6000}
          onClose={() => setIsSnackbarShow(false)}
          message={snackbarMsg}
        />
      </ForgotPasswordContainer>
    </AppTheme>
  );
}
