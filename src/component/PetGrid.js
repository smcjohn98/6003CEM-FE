import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow, differenceInYears } from 'date-fns';
import { PetBreed } from '../function/Constrant';
import PetModal from './PetModal';
import axios from 'axios';
import { FormControl, Select, MenuItem, Checkbox } from '@mui/material';
import FavoriteOutlined from '@mui/icons-material/FavoriteOutlined';

import {
  setPetList,
  getPetList,
  getAction,
  setCreate, 
  setEdit, 
  setView,
  getFetchKey,
  getUser,
  getLoading,
  updateFetchKey
} from '../redux/PetReducer';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';

export default function PetGrid() {
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const petList = useSelector(getPetList);
  const action = useSelector(getAction);
  const loading = useSelector(getLoading);
  const fetchKey = useSelector(getFetchKey);
  
  const user = useSelector(getUser);
  const [searchCriteria, setSearchCriteria] = useState({name:"", breed:"", sex:"", fav:false});
  const dispatch = useDispatch();
  
  useEffect(() => { 
    if(!loading){
      axios.get('/pet', {params: {...searchCriteria, offset:offset} })
      .then(function (response) {
        console.log(response.data.data.pet);
        setTotalCount(response.data.data.count)
        dispatch(setPetList(response.data.data.pet));
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [fetchKey, loading]);

  const handleAddToFavourite = (petId) => {
    axios.post(`/watchlist`, {userId:user.userId, petId:petId}).then((response)=>{
      console.log(response.data);
      dispatch(updateFetchKey());
    })
    .catch((error) => { 
      console.log(error);
    })
  }

  const handlePage = (event, value) => {
    setOffset((value-1) * 12);
    dispatch(updateFetchKey());
  };

  const handleRemoveFromFavourite = (id) => {
    axios.delete(`/watchlist/${id}`).then((response)=>{
      console.log(response.data);
      dispatch(updateFetchKey());
    })
    .catch((error) => { 
      console.log(error);
    })
  }

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
          
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Name: <TextField  sx={{ mr:3, width:"20%"}} size="small" value={searchCriteria.name} onChange={(e)=>{setSearchCriteria({...searchCriteria, name:e.target.value}) }}/>
            Breed:
            <FormControl sx={{ mr:3, minWidth: "25%" }} size="small">
              <Select
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                value={searchCriteria.breed}
                onChange={(e)=>setSearchCriteria({...searchCriteria, breed:e.target.value})}
              >
                <MenuItem value={""}>All Breeds</MenuItem>
                {
                  Object.keys(PetBreed).map((key) => {
                    return (
                      <MenuItem value={key}>{PetBreed[key]}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
            Sex:
            <FormControl sx={{ minWidth: "15%" }} size="small">
              <Select
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                value={searchCriteria.sex}
                onChange={(e)=>setSearchCriteria({...searchCriteria, sex:e.target.value})}
              >
                <MenuItem value={""}>All</MenuItem>
                <MenuItem value={"F"}>Female</MenuItem>
                <MenuItem value={"M"}>Male</MenuItem>
              </Select>
            </FormControl>
            

            { user.userId &&
              <span>
                Favourite:
                <Checkbox value={searchCriteria.fav} onChange={(e)=>setSearchCriteria({...searchCriteria, fav:e.target.checked})}/> 
              </span>
            }
            </Typography>

            

           
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              
            </Typography>
            { user && (user.role === "admin" || user.role === "charity") &&
            <Button variant="contained" onClick={()=>{dispatch(setCreate())}} sx={{mr:2}}>Add</Button> }
            <Button variant="contained" onClick={()=>{dispatch(updateFetchKey())}} sx={{mr:2}}>Search</Button>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="lg">
          {/* End hero unit */}
          <Grid container spacing={4}>
            { petList && petList.map((pet,key) => (
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
                      {user.userId &&
                        (
                          pet.watchlists && pet.watchlists.length ? 
                          <FavoriteOutlined color="error" onClick={()=>handleRemoveFromFavourite(pet.watchlists[0].id)} sx={{ml:2, cursor:"pointer"}} /> :
                          <FavoriteOutlined onClick={()=>handleAddToFavourite(pet.id)} sx={{ml:2, cursor:"pointer"}} />
                        )
                      }
                    </Typography>
                    <Typography >
                      Breed : {PetBreed[pet.breed]}
                    </Typography>
                    <Typography >
                      Sex : {pet.sex === 'F' ? 'Female' : 'Male'}
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
                    
                    <Link to={`/pet/${pet.id}`}>
                      <Button sx={{mr:1}} variant="contained" size="small">View</Button>
                    </Link>
                    { user && (user.role === "admin" || user.role === "charity") &&
                    <Button variant="contained" size="small" onClick={()=>{dispatch(setEdit(key))}}>Edit</Button> }

                    { user && (user.role === "admin" || user.role === "charity") &&
                    <Button variant="contained" color="error" size="small" onClick={()=>handleDelete(pet.id)}>Delete</Button> }

                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Stack alignItems="center" sx={{mt:3}}>
              <Pagination onChange={handlePage} count={Math.ceil(totalCount/12)} color='primary' />
          </Stack>
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