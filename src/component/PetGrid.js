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
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow, differenceInYears } from 'date-fns';
import PetModal from './PetModal';
import axios from 'axios';

import FavoriteOutlined from '@mui/icons-material/FavoriteOutlined';

import {
  addPet,
  setPetList,
  clearPetList,
  getPetList,
  getAction,
  setLoading,
  setCreate, setEdit, setView, setNoAction,
  getFetchKey,
  getUser,
  updateFetchKey
} from '../redux/PetReducer';
import { TextField } from '@mui/material';

export default function PetGrid() {
  const petList = useSelector(getPetList);
  const action = useSelector(getAction);
  const fetchKey = useSelector(getFetchKey);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setLoading(true));
    axios.get('/pet')
    .then(function (response) {
      console.log(response.data);
      dispatch(setPetList(response.data.data.pet));
      dispatch(setLoading(false));
    })
    .catch(error => {
      console.error(error);
    });
  }, [fetchKey]);

  const handleDelete = (id) => {
    axios.delete(`/pet/${id}`).then((response)=>{
      console.log(response.data);
      dispatch(updateFetchKey());
    })
    .catch((error) => {
      console.log(error);
    })
  }

  return (
    <>
      { action && <PetModal action={action} key={1}/>}
      <main>
        
        <Box
          sx={{
            bgcolor: '#cfe8fc',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="md" >
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Pet Adaption
            </Typography>
            <TextField sx={{width:'100%'}}> Name </TextField>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Something short and leading about the collection below—its contents,
              the creator, etc. Make it short and sweet, but not too short so folks
              don&apos;t simply skip over it entirely.
            </Typography>
            { user && (user.role === "admin" || user.role === "charity") &&
            <Button variant="contained" onClick={()=>{dispatch(setCreate())}} sx={{mr:2}}>Add</Button> }
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
                    image={pet.thumbnail?`http://localhost:5000/images/${pet.thumbnail}`:"/default.jpg"}
                    alt="random"
                  />
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" >
                      {pet.name}
                      <FavoriteOutlined sx={{ml:2, cursor:"pointer"}} />
                    </Typography>
                    <Typography >
                      Breed : {pet.breed}
                    </Typography>
                    <Typography>
                      {
                        pet.dob && 'Age : ' + differenceInYears(new Date(), new Date(pet.dob))
                      }
                    </Typography>
                    <Typography>
                      Born on {pet.dob}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                      { pet.updatedAt &&
                        'Last updated :' + formatDistanceToNow(new Date(pet.updatedAt), { addSuffix: true })
                      }
                    </Typography>
                  </CardContent>
                  <CardActions style={{margin:'auto'}}>
                    <Button variant="contained" size="small" onClick={()=>{dispatch(setView(key))}}>View</Button>
                    { user && (user.role === "admin" || user.role === "charity") &&
                    <Button variant="contained" size="small" onClick={()=>{dispatch(setEdit(key))}}>Edit</Button> }

                    { user && (user.role === "admin" || user.role === "charity") &&
                    <Button variant="contained" color="error" size="small" onClick={()=>handleDelete(pet.id)}>Delete</Button> }

                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          227020426 - Suen Man Chun
        </Typography>
      </Box>
      {/* End footer */}
    </>
  );
}