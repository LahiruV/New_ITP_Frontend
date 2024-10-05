import { AppBar, Toolbar, Typography, Button, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();
const MainNavbar = () => {  
    
  const linkStyle = {
    color: 'inherit',
    textDecoration: 'none',
  };

  const activeStyle = {
    color: '#0080FF',
  };

  const getLinkStyle = ({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle);

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="fixed">
        <Toolbar style={{ justifyContent: 'space-between', backgroundColor: '#282828' }}>
          <Typography variant="h6" component={NavLink} to="/" style={{ ...linkStyle, flexGrow: 1, fontWeight: 'bolder' }}>
          UniBodim<span style={{ color: '#0080FF' }}>-Finder</span>
          </Typography>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <MenuItem component={NavLink} to="/" style={getLinkStyle}>
              Home
            </MenuItem>                      
            <Button variant="contained" color="primary" component={NavLink} to="/Register">
              Register
            </Button>
            <Button variant="contained" color="primary" component={NavLink} to="/Login">
              Login
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default MainNavbar;
