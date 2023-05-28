import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import axios from 'axios';

export default function SignUp() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isCharity, setCharity] = useState(false);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [charityName, setCharityName] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = () => {
    return regex.test(username);
  }
  
  const handleSignUp = () => {
    if(!name || !username || !password || !passwordConfirmation || (isCharity && (!signupCode || !location || !phone || !charityName))){
      setError(true);
      return;
    }

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
    if(password !== passwordConfirmation){
      setError(true);
      setErrorMessage("Password not match")
      return;
    }


    var obj = {name:name, username:username, password:password, isCharity:isCharity}
    if(isCharity){
      obj.signupCode = signupCode
      obj.location = location
      obj.phone = phone
      obj.charityName = charityName
    }

    axios.post("/user", obj).then(response => {
      setError(false);
      setErrorMessage("Succeed! Please Login Again");
      console.log(response);
    })
    .catch(e=>{
      setErrorMessage(e.response.data.message)
      setError(true);
    });

    console.log(isCharity);
  };

  return (
      <Container component="main" maxWidth="xs">
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
            Sign up
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={error && (!username || !validateEmail())}
                  required
                  fullWidth
                  label="Email Address"
                  value={username}
                  onChange={(e)=>setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={error && (!password || password.length < 8 )}
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={error && (!passwordConfirmation || password !== passwordConfirmation)}
                  required
                  fullWidth
                  label="Password Confirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e)=>setPasswordConfirmation(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={error && !name}
                  required
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox
                    checked={isCharity}
                    onChange={(e)=>setCharity(e.target.checked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />}
                  label="Have Sign Up Code? Register As A Charity"
                />
              </Grid>
              { isCharity && 
                <Grid item xs={12}>
                  <TextField
                    error={error && !signupCode}
                    required
                    fullWidth
                    label="SignUp Code"
                    value={signupCode}
                    onChange={(e)=>setSignupCode(e.target.value)}
                  />
                </Grid>
              }
              { isCharity && 
                <Grid item xs={12}>
                  <TextField
                    error={error && !charityName}
                    required
                    fullWidth
                    label="Charity Name"
                    value={charityName}
                    onChange={(e)=>setCharityName(e.target.value)}
                  />
                </Grid>
              }
              { isCharity && 
                <Grid item xs={12}>
                  <TextField
                    error={error && !location}
                    required
                    fullWidth
                    label="Location"
                    value={location}
                    onChange={(e)=>setLocation(e.target.value)}
                  />
                </Grid>
              }
              { isCharity && 
                <Grid item xs={12}>
                  <TextField
                    error={error && !phone}
                    required
                    fullWidth
                    label="Phone"
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                  />
                </Grid>
              }
            </Grid>
            { errorMessage &&
            <Alert severity={error?"error":"success"}>{errorMessage}</Alert> }
            <Button
              disabled={!error && errorMessage}
              onClick={handleSignUp}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}