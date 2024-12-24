import * as React from 'react';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuButton from './MenuButton';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

export default function OptionsMenu() {
  const navigate = useNavigate();

  const handleClick = async (event) => {

    try {
      await logout();
      console.log('User logged out successfully!');

      navigate('/');
    } catch (err) {
      console.log('Error logging out: ' + err.message);
    }
  };
  return (
    <React.Fragment>
      <MenuButton
        aria-label="Logout"
        onClick={handleClick}
        sx={{ borderColor: 'transparent' }}
      >
        <LogoutRoundedIcon />
      </MenuButton>
    </React.Fragment>
  );
}
