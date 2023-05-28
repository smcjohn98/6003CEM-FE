import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect, useLayoutEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ImageUploading from 'react-images-uploading';
import { Select, MenuItem, InputLabel, FormControl, Typography, Checkbox } from '@mui/material';
import { PetBreed } from '../function/Constrant';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from 'axios';
import {
  addPet,
  clearPetList,
  getPetList,
  getAction, EDIT_ACTION, editPet,
  setCreate, setEdit, setView, setNoAction, getSelectIndex,
  CREATE_ACTION, VIEW_ACTION, updateFetchKey
} from '../redux/PetReducer';
import "./pet.css"

export default function PetModal(props) {
  const html = '';
  const contentBlock = htmlToDraft(html);
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  const [petName, setPetName] = useState("");
  const [petDob, setPetDob] = useState(dayjs(new Date().toLocaleString()));
  const [petBreed, setPetBreed] = useState("abys");
  const [petSex, setPetSex] = useState("M");
  const [postTwitter, setPostTwitter] = useState(false);
  const [description, setDescription] = useState(EditorState.createWithContent(contentState));
  const [error, setError] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const selectIndex = useSelector(getSelectIndex);
  const petList = useSelector(getPetList);
  
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setNoAction());
    setPetName("");
    setPetDob(dayjs(new Date().toLocaleString()));
    setThumbnail(null);
    setPreview(null);
    setError(false);
    setPetBreed('abys');
    setPetSex('M');
    setPostTwitter(false);
  };

  const handleUpdate = (event) => {
    if(!petName || !petDob){
      setError(true);
      return;
    }

    /*const obj = {selectIndex:selectIndex, name: petName, dob: petDob.format('YYYY-MM-DD')};
    dispatch(editPet(obj));*/

    let formData = new FormData();
    formData.append('name', petName);
    formData.append('dob', petDob.format('YYYY-MM-DD'));
    formData.append('type', 'cat');
    formData.append('breed', petBreed);
    formData.append('image', thumbnail);
    formData.append('sex', petSex);
    formData.append('description', draftToHtml(convertToRaw(description.getCurrentContent())))

    const id = petList[selectIndex].id;
    /*const pet = {id: id, name: petName, dob: petDob.format('YYYY-MM-DD'), type:'cat', breed:'DSH'};
    axios.put(`/pet/${id}`, pet).then((response)=>{
      console.log(response.data);
      dispatch(updateFetchKey());
    })
    .catch((error) => {
      console.log(error);
    })*/

    axios.put(`/pet/${id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}}).then((response)=>{
      console.log(response.data);
      dispatch(updateFetchKey());
    })
    .catch((error) => {
      console.log(error);
    })

    handleClose();
  }

  const handleCreate = (event) => {
    if(!petName || !petDob){
      setError(true);
      return;
    }
    let formData = new FormData();
    formData.append('name', petName);
    formData.append('dob', petDob.format('YYYY-MM-DD'));
    formData.append('type', 'cat');
    formData.append('breed', petBreed);
    formData.append('image', thumbnail);
    formData.append('sex', petSex);
    formData.append('postTwitter', postTwitter);
    formData.append('description', draftToHtml(convertToRaw(description.getCurrentContent())))

    //const pet = {name: petName, dob: petDob.format('YYYY-MM-DD'), type:'cat', breed:'DSH'};
    axios.post('/pet', formData, {headers: {'Content-Type': 'multipart/form-data'}}).then((response)=>{
      console.log(response.data);
      dispatch(updateFetchKey());
    })
    .catch((error) => {
      console.log(error);
    })
    handleClose();
  }

  const handleFileChange = (event) => {
    setThumbnail(event.target.files[0]);
    setPreview(URL.createObjectURL(event.target.files[0]));
    console.log(event.target.files[0]);
    //setPreview(URL.createObjectURL(event.target.files[0]));
  };
  
  useLayoutEffect(() => {
    if(props.action === EDIT_ACTION || props.action === VIEW_ACTION){
      setPetName(petList[selectIndex].name)
      setPetDob(dayjs(petList[selectIndex].dob))
      setPetSex(petList[selectIndex].sex)
      setPetBreed(petList[selectIndex].breed)
      const a = htmlToDraft(petList[selectIndex].description);
      const b = ContentState.createFromBlockArray(a.contentBlocks);
      
      setDescription(EditorState.createWithContent(b))
      if(petList[selectIndex].thumbnail){
        setThumbnail(petList[selectIndex].thumbnail)
        setPreview("http://localhost:5000/images/"+petList[selectIndex].thumbnail)
      }
    }
  }, [selectIndex, props.action]);

  const onEditorStateChange = (editorState) => {
    setDescription(editorState);
  };

  return (
    <Dialog open={props.action > -1} fullWidth>
      <DialogTitle>
        { props.action === EDIT_ACTION && "Edit Pet"}
        { props.action === VIEW_ACTION && "View Pet"}
        { props.action === CREATE_ACTION && "Create Pet"}
      </DialogTitle>
      <DialogContent>

      { props.action !== VIEW_ACTION && preview && <img style={{maxWidth:"100%"}} src={preview} alt="Preview" />}

        { props.action === VIEW_ACTION ? 

          thumbnail && <img style={{maxWidth:"100%"}} src={"http://localhost:5000/images/"+petList[selectIndex].thumbnail}/> : 
          
          <Button variant="contained" component="label">
            Upload Image
            <input onChange={handleFileChange} hidden accept="image/*" type="file" />
          </Button>

          
        }
        
        <TextField
          error={error && !petName}
          autoFocus
          margin="dense"
          id="name"
          label="Pet Name"
          fullWidth
          variant="standard"
          value={petName}
          InputProps={{
            readOnly: props.action === VIEW_ACTION,
          }}
          sx={{mb:3}}
          onChange={(e) => setPetName(e.target.value)}
        />
        <FormControl fullWidth sx={{mb:2}}>
          <InputLabel id="demo-simple-select-label">Breed</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Breed"
            value={petBreed}
            onChange={(e)=>setPetBreed(e.target.value)}
            disabled={props.action === VIEW_ACTION}
          >
            {
              Object.keys(PetBreed).map((key) => {
                return (
                  <MenuItem value={key}>{PetBreed[key]}</MenuItem>
                )
              })
            }
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{mb:2}}>
          <InputLabel id="demo-simple-select-label">Sex</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Sex"
            value={petSex}
            onChange={(e)=>setPetSex(e.target.value)}
            disabled={props.action === VIEW_ACTION}
          >
            <MenuItem value={'M'}>Male</MenuItem>
            <MenuItem value={'F'}>Female</MenuItem>
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker', 'DatePicker']} >
            <DatePicker
            label="Date of birth"
            value={petDob}
            onChange={(newValue) => setPetDob(newValue)}
            readOnly={props.action === VIEW_ACTION}
            format="YYYY-MM-DD"
            slotProps={{ textField: { fullWidth: true } }}
            />
          </DemoContainer>
        </LocalizationProvider> 
        
        <Typography sx={{mt:2}} gutterBottom>Description</Typography>
        <Editor
          editorState={description}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
          placeholder='Write something'
        />
        Post Twitter: 
        <Checkbox checked={postTwitter} onChange={(e)=>setPostTwitter(e.target.checked)}/> 
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        { props.action === EDIT_ACTION && <Button onClick={handleUpdate}>Edit</Button> }
        { props.action === CREATE_ACTION && <Button onClick={handleCreate}>Create</Button> }
      </DialogActions>
    </Dialog>
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