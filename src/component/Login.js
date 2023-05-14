import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import { getToken } from '../redux/PetReducer';
import { useSelector } from 'react-redux';

export default function Login() {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const token = useSelector(getToken);

  useEffect(()=>{
    if(token){
      setInterval(()=>{
        window.location.href = "/";
      },3000)
    }
  },[])

  const handleSubmit = (event) => {
    event.preventDefault();
    /*console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    const email = data.get('email');
    const password = data.get('password');*/

    if(!validateEmail()){
      setError(true);
      setErrorMessage("Not a valid email format")
      return;
    }
    if(password.length < 8){
      setError(true);
      setErrorMessage("Password minimum 8 characters required!")
      return;
    }

    axios.post('/user/login', {username:email, password:password}).then((response)=>{
      console.log(response.data);
      localStorage.setItem('token', response.data.data.jwt)
      window.location.href = "/";
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage(error.response.data.message);
    })

  };

  const validateEmail = () => {
    return regex.test(email);
  }

  if(token)
    return (
      <Alert severity="success">You have already logged, you will be redirected after 3 seconds</Alert>
    )

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              error={error && (!email || !validateEmail())}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
            />
            <TextField
              error={error && (!password)}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
            />

            { errorMessage && <Alert severity="error">{errorMessage}</Alert> }

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}