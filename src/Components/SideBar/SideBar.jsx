import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InventoryIcon from '@mui/icons-material/Inventory';
import BadgeIcon from '@mui/icons-material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@material-ui/core';

const SideBar = () => {
  const defaultTheme = createTheme();
  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const navigate = useNavigate();
  const adminType = sessionStorage.getItem("admintype")

  useEffect(() => {
    const storedSelectedItem = window.sessionStorage.getItem('selectedItem');
    if (storedSelectedItem) {
      setSelectedItem(storedSelectedItem);
    }
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    window.sessionStorage.setItem('selectedItem', item);
    navigate(`/${item}`);
  };

  const handleLogout = () => {
    sessionStorage.setItem("hradmin", false);
    window.location.href = `/`;

  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Drawer
        anchor="left"
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1c2331',
            color: '#ffffff',
          },
        }}
      >
        {adminType === 'Owner' && (
          <>
            <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
              <Typography variant="h5" sx={{ color: '#ecf0f1' }}>
                Owner Panel
              </Typography>
            </Toolbar>
            <List>
              <ListItem
                button
                selected={selectedItem === 'propertyDash'}
                onClick={() => handleItemClick('propertyDash')}
                sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
              >
                <ListItemIcon>
                  <BadgeIcon sx={{ color: '#ecf0f1' }} />
                </ListItemIcon>
                <ListItemText primary="Property" />
              </ListItem>
            </List>
            <List sx={{ marginTop: 'auto' }}>
              <ListItem button onClick={handleLogout} sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}>
                <LogoutIcon>
                  <InventoryIcon sx={{ color: '#ecf0f1' }} />
                </LogoutIcon>
                <ListItemText primary="Logout" sx={{ paddingLeft: '50px' }} />
              </ListItem>
            </List>
          </>
        )}
        {adminType === 'Staff' && (
          <>
            <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
              <Typography variant="h5" sx={{ color: '#ecf0f1' }}>
                Admin Panel
              </Typography>
            </Toolbar>
            <List>
              <>
                <ListItem
                  button
                  selected={selectedItem === 'staffDash'}
                  onClick={() => handleItemClick('staffDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Staff" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedItem === 'advertisementDash'}
                  onClick={() => handleItemClick('advertisementDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Advertisement" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedItem === 'foodMenuDash'}
                  onClick={() => handleItemClick('foodMenuDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Food & Menu" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedItem === 'serviceDash'}
                  onClick={() => handleItemClick('serviceDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Service" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedItem === 'bookingDash'}
                  onClick={() => handleItemClick('bookingDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Booking" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedItem === 'utilityDash'}
                  onClick={() => handleItemClick('utilityDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Utility" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedItem === 'foodReqDash'}
                  onClick={() => handleItemClick('foodReqDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Foods Requests" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedItem === 'financeDash'}
                  onClick={() => handleItemClick('financeDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Finance" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedItem === 'propertyDash'}
                  onClick={() => handleItemClick('propertyDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Property" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedItem === 'mapDash'}
                  onClick={() => handleItemClick('mapDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Map" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedItem === 'ticketDash'}
                  onClick={() => handleItemClick('ticketDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Support Tickets" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedItem === 'feedbackDash'}
                  onClick={() => handleItemClick('feedbackDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Feedback" />
                </ListItem>
              </>
            </List>
            <List sx={{ marginTop: 'auto' }}>
              <ListItem button onClick={handleLogout} sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}>
                <LogoutIcon>
                  <InventoryIcon sx={{ color: '#ecf0f1' }} />
                </LogoutIcon>
                <ListItemText primary="Logout" sx={{ paddingLeft: '50px' }} />
              </ListItem>
            </List>
          </>
        )}
      </Drawer>
    </ThemeProvider>
  );
};

export default SideBar;
