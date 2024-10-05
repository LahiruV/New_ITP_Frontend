import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, MenuItem, Menu, IconButton } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const defaultTheme = createTheme();
const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleLogout = () => {
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('user', '');
    window.location.href = '/';
  };

  const clickHome = () => {
    window.location.href = '/home';
  };

  const linkStyle = {
    color: 'inherit',
    textDecoration: 'none',
  };

  const activeStyle = {
    color: '#0080FF',
  };

  const getLinkStyle = ({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle);

  useEffect(() => {
    if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === '') {
      window.location.href = '/';
    }
  }
    , []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="fixed">
        <Toolbar style={{ justifyContent: 'space-between', backgroundColor: '#282828' }}>
          <Typography variant="h6" component={NavLink} to="/" style={{ ...linkStyle, flexGrow: 1, fontWeight: 'bolder' }}>
            UniBodim<span style={{ color: '#0080FF' }}>-Finder</span>
          </Typography>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <MenuItem component={NavLink} to="/home" style={getLinkStyle} onClick={clickHome}>
              Home
            </MenuItem>
            <MenuItem>
              <IconButton
                color="inherit"
                onClick={handleMenuClick2}
                aria-controls="booking-menu"
                aria-haspopup="true"
                sx={{ fontSize: 16 }}
              >
                Boarding Places
                <ArrowDropDownIcon />
              </IconButton>
              <Menu
                id="booking-menu"
                anchorEl={anchorEl2}
                open={Boolean(anchorEl2)}
                onClose={handleMenuClose2}
              >
                <MenuItem component={NavLink} to="/bodims" style={getLinkStyle} onClick={handleMenuClose2}>
                  Boarding Places
                </MenuItem>
                <MenuItem component={NavLink} to="/booking" style={getLinkStyle} onClick={handleMenuClose2}>
                  Bookings
                </MenuItem>
              </Menu>
            </MenuItem>
            <MenuItem component={NavLink} to="/services" style={getLinkStyle}>
              Services
            </MenuItem>
            <MenuItem component={NavLink} to="/foods" style={getLinkStyle}>
              Foods
            </MenuItem>
            <MenuItem component={NavLink} to="/ads" style={getLinkStyle}>
              ADS
            </MenuItem>
            <MenuItem component={NavLink} to="/googleMap" style={getLinkStyle} onClick={() => { window.location.href = '/googleMap'; }}>
              Map
            </MenuItem>
            {/* Dropdown for Support Ticket and Tickets */}
            <MenuItem>
              <IconButton
                color="inherit"
                onClick={handleMenuClick}
                aria-controls="support-ticket-menu"
                aria-haspopup="true"
                sx={{ fontSize: 16 }}
              >
                Support <ArrowDropDownIcon />
              </IconButton>
              <Menu
                id="support-ticket-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem component={NavLink} to="/supticket" style={getLinkStyle} onClick={handleMenuClose}>
                  Support Ticket
                </MenuItem>
                <MenuItem component={NavLink} to="/suptickets" style={getLinkStyle} onClick={handleMenuClose}>
                  Tickets
                </MenuItem>
              </Menu>
            </MenuItem>

            <MenuItem component={NavLink} to="/feedback" style={getLinkStyle} onClick={() => (window.location.href = '/feedback')}>
              Feedback
            </MenuItem>
            <MenuItem component={NavLink} to="/profile" style={getLinkStyle}>
              Profile
            </MenuItem>
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
