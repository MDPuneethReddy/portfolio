import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Button,
  Typography,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as ScrollLink } from 'react-scroll';
import { pages } from "../utils";

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Puneeth Reddy
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ my: 2, color: 'white', marginLeft: 2 }}
              >
                <ScrollLink to={page.toLowerCase()} smooth={true} duration={500}>
                  {page}
                </ScrollLink>
              </Button>
            ))}
            
            <button
  style={{
    cursor: 'pointer',
    background: 'transparent',
    fontSize: '16px',
    color: 'white',
    padding: '10px 20px',
  }}
  onClick={() => window.open("https://blog.mdpuneethreddy.com", '_blank', 'noopener')}
>
  Blog
</button>

          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              <List>
                {pages.map((page) => (
                  <ListItem key={page} onClick={handleCloseNavMenu}>
                    <ScrollLink to={page.toLowerCase()} smooth={true} duration={500} initial="0">
                      <ListItemText primary={page} />
                    </ScrollLink>
                  </ListItem>
                ))}
              </List>
              <button
  style={{
    cursor: 'pointer',
    background: 'transparent',
    fontSize: '16px',
    color: 'black',
    padding: '10px 20px',
  }}
  onClick={() => window.open("https://blog.mdpuneethreddy.com", '_blank', 'noopener')}
>
  Blog
</button>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export { Navbar };
