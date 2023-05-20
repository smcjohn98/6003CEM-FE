import Button from '@mui/material/Button';
import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Container } from '@mui/material';
import { PetBreed } from '../function/Constrant';
import { Card, CardContent, Typography } from '@mui/material';
import { formatDistanceToNow, differenceInYears } from 'date-fns';
import { useParams } from 'react-router';
import axios from 'axios';
import FavoriteOutlined from '@mui/icons-material/FavoriteOutlined';
import { getLoading, getUser } from '../redux/PetReducer';

export default function PetDetail(props) {
  const { id } = useParams();
  const [pet, setPet] = useState({});
  const [fetchKey, setFetchKey] = useState(0);
  const user = useSelector(getUser);
  const loading = useSelector(getLoading);
  
  useEffect(() => { 
    if(!loading){
      console.log(id);
      axios.get(`/pet/${id}`)
      .then(function (response) {
        setPet(response.data.data.pet);
        console.log(response.data.data.pet);
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [loading, fetchKey]);

  const handleAddToFavourite = (petId) => {
    axios.post(`/watchlist`, {userId:user.userId, petId:petId}).then((response)=>{
      console.log(response.data);
      setFetchKey(fetchKey+1);
    })
    .catch((error) => { 
      console.log(error);
    })
  }

  const handleRemoveFromFavourite = (id) => {
    axios.delete(`/watchlist/${id}`).then((response)=>{
      console.log(response.data);
      setFetchKey(fetchKey+1);
    })
    .catch((error) => { 
      console.log(error);
    })
  }

  return (
    <>
      <Box sx={{width:'100%', bgcolor: '#cfe8fc', textAlign:"center"}}>
      <img style={{height:"500px"}} src={pet.thumbnail?`http://localhost:5000/images/${pet.thumbnail}`:"/default.jpg"}/>
      </Box>
      
      <Container>
        <Grid maxWidth="lg" container spacing={2}>
          <Grid item xs={8}>
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: 40 }} color="text.primary" gutterBottom>
                  {pet.name}
                  {user.userId &&
                    (
                      pet.watchlists && pet.watchlists.length ? 
                      <FavoriteOutlined color="error" onClick={()=>handleRemoveFromFavourite(pet.watchlists[0].id)} sx={{ml:2, cursor:"pointer"}} /> :
                      <FavoriteOutlined onClick={()=>handleAddToFavourite(pet.id)} sx={{ml:2, cursor:"pointer"}} />
                    )
                  }
                </Typography>
                <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
                  {PetBreed[pet.breed]}
                </Typography>
                <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
                  {pet.sex === 'F' ? 'Female' : 'Male'}
                </Typography>
                <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
                  {
                    pet.dob && 'Age : ' + differenceInYears(new Date(), new Date(pet.dob))
                  }
                </Typography>
                <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
                  Born on {pet.dob}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  { pet.updatedAt &&
                    'Last updated :' + formatDistanceToNow(new Date(pet.updatedAt), { addSuffix: true })
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} align="center">
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
                  Considering {pet.name} for adoption?
                </Typography>
                <Button variant="contained" fullWidth={true} sx={{mb:2, borderRadius:10}}>Contact Us</Button> 
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
    </>
  );
}


/*
<ImageUploading
          
          value={thumbnail}
          onChange={onChange}

          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            // write your building UI
            <div className="upload__image-wrapper">
              <button
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </button>
              &nbsp;
              <button onClick={onImageRemoveAll}>Remove all images</button>
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image['data_url']} alt="" width="100" />
                  <div className="image-item__btn-wrapper">
                    <button onClick={() => onImageUpdate(index)}>Update</button>
                    <button onClick={() => onImageRemove(index)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>

        */