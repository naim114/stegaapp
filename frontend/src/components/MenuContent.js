import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import BiotechIcon from '@mui/icons-material/Biotech';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIcon from '@mui/icons-material/Assignment';

const mainListItems = [
  { name: 'home', text: 'Home', icon: <HomeRoundedIcon /> },
  { name: 'steganalysis', text: 'Steganalysis', icon: <BiotechIcon /> },
  { name: 'reporting', text: 'Reporting', icon: <AnalyticsRoundedIcon /> },
  { name: 'profile', text: 'Profile', icon: <AccountCircleIcon /> },
  { name: 'activity', text: 'Activity Log', icon: <AssignmentIcon /> },
  { name: 'admin', text: 'Admin', icon: <AdminPanelSettingsIcon /> },
];

const secondaryListItems = [
  // { text: 'Settings', icon: <SettingsRoundedIcon /> },
];

export default function MenuContent({ pageName, ...props }) {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={item.name === pageName} onClick={() => props.onClick(item.name)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
