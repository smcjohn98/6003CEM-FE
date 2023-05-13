import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PetModal from './PetModal';
import {
  addPet,
  clearPetList,
  getPetList,
  getAction,
  setCreate, setEdit, setView, setNoAction
} from '../redux/PetReducer';

export default function PetGrid() {
  const petList = useSelector(getPetList);
  const action = useSelector(getAction);
  const dispatch = useDispatch();
  
  return (
    <>
      { action && <PetModal action={action} key={1}/>}
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Cat List
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Something short and leading about the collection below—its contents,
              the creator, etc. Make it short and sweet, but not too short so folks
              don&apos;t simply skip over it entirely.
            </Typography>
            <Button variant="contained" onClick={()=>{dispatch(setCreate())}} sx={{mr:2}}>Add</Button>
            <Button variant="contained" onClick={()=>{dispatch(clearPetList())}}>Clear</Button>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {petList.map((pet,key) => (
              <Grid item key={pet.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    image="https://source.unsplash.com/random"
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {pet.name}
                    </Typography>
                    <Typography>
                      Born on {pet.dob}
                    </Typography>
                  </CardContent>
                  <CardActions style={{margin:'auto'}}>
                    <Button size="small" onClick={()=>{dispatch(setView(key))}}>View</Button>
                    <Button size="small" onClick={()=>{dispatch(setEdit(key))}}>Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
      </Box>
      {/* End footer */}
    </>
  );
}