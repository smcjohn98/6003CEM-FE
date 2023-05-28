import Button from '@mui/material/Button';
import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { PetBreed } from '../function/Constrant';
import { Card, CardContent, Typography } from '@mui/material';
import { formatDistanceToNow, differenceInYears } from 'date-fns';
import { useParams } from 'react-router';
import axios from 'axios';
import FavoriteOutlined from '@mui/icons-material/FavoriteOutlined';
import { getLoading, getUser } from '../redux/PetReducer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Carousel from 'react-material-ui-carousel'
import { Box, Grid, Container, Paper } from '@mui/material';
import "./pet.css"

export default function BreedHelper(props) {
  const [breedList, setBreedList] = useState({})
  const [selectBreed, setSelectBreed] = useState(null)
  const [breedImages, setBreedImages] = useState([])

  useEffect(() => { 
    axios.get('https://api.thecatapi.com/v1/breeds').then(response => {
      //setBreedList(response.data)
      let obj = {}
      console.log(response.data)
      response.data.map((breed,key)=>{
        obj[breed.id] = breed
      })
      setBreedList(obj);
      setSelectBreed("abys")
    }).catch(e=>console.log(e))
  }, []);

  useEffect(() => { 
    axios.get(`https://api.thecatapi.com/v1/images/search?limit=5&breed_ids=${selectBreed}`).then(response => {
      //setBreedList(response.data)
      let breedImages = []
      response.data.map(r=>{
        breedImages.push(r.url)
      })
      setBreedImages(breedImages)
      console.log(breedImages)

    }).catch(e=>console.log(e))
  }, [selectBreed]);



  return (
    <>
      <FormControl fullWidth sx={{mt:3, mb:2}}>
        <Select value={selectBreed} onChange={(e)=>{setSelectBreed(e.target.value)}}>
          {
            Object.keys(breedList).map(breedId=>(
              <MenuItem value={breedId}>{breedList[breedId].name}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      { selectBreed && 
      <>
          <Grid fullWidth  container spacing={2} sx={{pl:5, pr:5}}>
            <Grid item xs={6}>
              <Carousel animation="slide" autoPlay navButtonsAlwaysVisible>
              {
                  breedImages.map((bi,key) => (
                    <Paper key={key} className="carousel-item">
                      <img src={bi} className="carousel-image" />
                    </Paper>
                  ))
              }
            </Carousel>
            </Grid>
            <Grid item xs={6} sx={{textAlign:"center", margin:"auto"}}>
              <Typography variant="h4" gutterBottom>{breedList[selectBreed].name}</Typography>
              <Typography variant="h6" gutterBottom>{breedList[selectBreed].description}</Typography>
              <Typography variant="h6" gutterBottom>{breedList[selectBreed].temperament}</Typography>
              <Typography variant="h6" gutterBottom>{breedList[selectBreed].origin}</Typography>
              <Typography variant="h6" gutterBottom>{breedList[selectBreed].weight.metric} kgs</Typography>
              <Typography variant="h6" gutterBottom>{breedList[selectBreed].life_span} years life cycle</Typography>
            </Grid>
          </Grid>
      </>

       }
      
    </>
  );
}
