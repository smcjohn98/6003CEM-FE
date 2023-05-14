import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getUser, getToken, setToken } from '../redux/PetReducer';


export default function Header() {
  const token = useSelector(getToken);
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    localStorage.removeItem('token');
    dispatch(setToken(null));
    window.location.reload();
  }

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
          { user && user.role === "admin" &&
            <>
              <Divider orientation="vertical" flexItem />
              <Link to="/signup-code" style={{ textDecoration: 'none', color: 'White' }}>
                <Button color="inherit">Signup Code</Button>
              </Link>
            </>
          }
          { user && user.role === "admin" &&
            <>
              <Divider orientation="vertical" flexItem />
              <Link to="/user" style={{ textDecoration: 'none', color: 'White' }}>
                <Button color="inherit">User</Button>
              </Link>
            </>
          }
          <Divider orientation="vertical" flexItem />
          { !token ?
              <Link to="/login" style={{ textDecoration: 'none', color: 'White' }}>
                <Button color="inherit">Login</Button>
              </Link>
            :
              <Link to="/" style={{ textDecoration: 'none', color: 'White' }}>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </Link>
          }
          <Typography sx={{textAlign:"right"}} variant="h6" component="div" >Hi, {user.name}</Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}