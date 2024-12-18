import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Divider, { dividerClasses } from '@mui/material/Divider';
// import Menu from '@mui/material/Menu';
// import MuiMenuItem from '@mui/material/MenuItem';
// import { paperClasses } from '@mui/material/Paper';
// import { listClasses } from '@mui/material/List';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
// import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from './MenuButton';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

// const MenuItem = styled(MuiMenuItem)({
//   margin: '2px 0',
// });

export default function OptionsMenu() {
  const navigate = useNavigate();

  // const [setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);
  const handleClick = async (event) => {
    // setAnchorEl(event.currentTarget);

    try {
      await logout();
      console.log('User logged out successfully!');

      navigate('/');
    } catch (err) {
      console.log('Error logging out: ' + err.message);
    }
  };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  return (
    <React.Fragment>
      <MenuButton
        aria-label="Logout"
        onClick={handleClick}
        sx={{ borderColor: 'transparent' }}
      >
        <LogoutRoundedIcon />
      </MenuButton>
      {/* <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Activity Log</MenuItem>
        <Divider />
        <MenuItem
          onClick={handleClose}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu> */}
    </React.Fragment>
  );
}
