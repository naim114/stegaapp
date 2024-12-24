import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import BiotechIcon from '@mui/icons-material/Biotech';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { getCurrentUser } from '../services/auth';
import SecurityIcon from '@mui/icons-material/Security';

const mainListItems = [
  { name: 'home', text: 'Home', icon: <HomeRoundedIcon /> },
  { name: 'steganalysis', text: 'Steganalysis', icon: <BiotechIcon /> },
  { name: 'reporting', text: 'Reporting', icon: <AnalyticsRoundedIcon /> },
  { name: 'profile', text: 'Profile', icon: <AccountCircleIcon /> },
  { name: 'security', text: 'Security', icon: <SecurityIcon /> },
  { name: 'activity', text: 'Activity Log', icon: <AssignmentIcon /> },
  { name: 'admin', text: 'Admin', icon: <AdminPanelSettingsIcon /> },
];

export default function MenuContent({ pageName, ...props }) {
  const [filteredItems, setFilteredItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // State to track loading

  React.useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await getCurrentUser(); // Fetch the current user
        if (user.role === 'ADMIN') {
          setFilteredItems(mainListItems); // Show all items for admin
        } else {
          setFilteredItems(mainListItems.filter(item => item.name !== 'admin')); // Hide admin for non-admin users
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false); // Stop loading after the role is fetched
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress /> {/* Loading spinner */}
      </Box>
    );
  }

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {filteredItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={item.name === pageName} onClick={() => props.onClick(item.name)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
