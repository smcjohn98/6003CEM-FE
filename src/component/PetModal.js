import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect, useLayoutEffect } from 'react';
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
import {
  addPet,
  clearPetList,
  getPetList,
  getAction, EDIT_ACTION, editPet,
  setCreate, setEdit, setView, setNoAction, getSelectIndex,
  CREATE_ACTION, VIEW_ACTION
} from '../redux/PetReducer';


export default function PetModal(props) {
  const [petName, setPetName] = useState("");
  const [petDob, setPetDob] = useState(dayjs(new Date().toLocaleString()));
  const [error, setError] = useState(false);
  const selectIndex = useSelector(getSelectIndex);
  const petList = useSelector(getPetList);
  const dispatch = useDispatch();


  const handleClose = () => {
    dispatch(setNoAction());
    setPetName("");
    setPetDob(dayjs(new Date().toLocaleString()));
    setError(false);
  };

  const handleUpdate = (event) => {
    if(!petName || !petDob){
      setError(true);
      return;
    }
    const obj = {selectIndex:selectIndex, name: petName, dob: petDob.format('YYYY-MM-DD')};
    dispatch(editPet(obj));
    handleClose();
  }

  const handleCreate = (event) => {
    console.log(petDob)
    if(!petName || !petDob){
      setError(true);
      return;
    }
    const pet = {name: petName, dob: petDob.format('YYYY-MM-DD'), id:123, type:'cat'};
    dispatch(addPet(pet));
    handleClose();
  }

  /*const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    // You can access the values of the form fields using the state variables
    console.log(itemName, itemDescription);
    // Reset the form fields
    setItemName("");
    setItemDescription("");
    handleClose();
  };*/

  useLayoutEffect(() => {
    if(props.action === EDIT_ACTION || props.action === VIEW_ACTION){
      setPetName(petList[selectIndex].name)
      setPetDob(dayjs(petList[selectIndex].dob))
    }
  }, [selectIndex, props.action]);

  return (
    <Dialog open={props.action > -1} fullWidth>
      <DialogTitle>
        { props.action === EDIT_ACTION && "Edit Pet"}
        { props.action === VIEW_ACTION && "View Pet"}
        { props.action === CREATE_ACTION && "Create Pet"}
      </DialogTitle>
      <DialogContent>

        <TextField
          error={error && !petName}
          autoFocus
          margin="dense"
          id="name"
          label="Pet Name"
          type="email"
          fullWidth
          variant="standard"
          value={petName}
          InputProps={{
            readOnly: props.action === VIEW_ACTION,
          }}
          onChange={(e) => setPetName(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker', 'DatePicker']}>
            <DatePicker
            label="Date of birth"
            value={petDob}
            onChange={(newValue) => setPetDob(newValue)}
            readOnly={props.action === VIEW_ACTION}
            format="YYYY-MM-DD"
            />
          </DemoContainer>
        </LocalizationProvider>
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        { props.action === EDIT_ACTION && <Button onClick={handleUpdate}>Edit</Button> }
        { props.action === CREATE_ACTION && <Button onClick={handleCreate}>Create</Button> }
      </DialogActions>
    </Dialog>
  );
}
