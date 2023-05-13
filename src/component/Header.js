import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" 
          sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            Pet Adaption
          </Typography>
          <Link to="/" style={{ textDecoration: 'none', color: 'White' }}>
            <Button color="inherit">View Pet</Button>
          </Link>
          <Divider orientation="vertical" flexItem />
          <Link to="/signup-code" style={{ textDecoration: 'none', color: 'White' }}>
            <Button color="inherit">Signup Code</Button>
          </Link>
          <Divider orientation="vertical" flexItem />
          <Link to="/login" style={{ textDecoration: 'none', color: 'White' }}>
            <Button color="inherit">Login</Button>
        </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}