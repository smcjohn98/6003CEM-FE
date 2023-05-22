import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Avatar, Fab, Divider, TextField, Typography, Grid, Paper, Checkbox } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getLoading, getUser } from '../redux/PetReducer';
import { formatDistanceToNow, differenceInYears } from 'date-fns';
import ClearIcon from '@mui/icons-material/Clear';

const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

const stringAvatar = (name) => {
  let iconChar = null;

  if(name.split(' ').length > 1)
    iconChar = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  else
    iconChar = `${name[0]}`

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: iconChar,
  };
}

export default function Chat() {
  const [inputMessage, setInputMessage] = useState("");
  const [userList, setUserList] = useState([]);
  const [chatUser, setChatUser] = useState({});
  const [chat, setChat] = useState([]);
  const [chatFetchKey, setChatFetchKey] = useState(0);
  const user = useSelector(getUser);
  const loading = useSelector(getLoading);
  const scrollRef = useRef();

  useEffect(() => { 
    const enquiryUserId = localStorage.getItem('enquiryUserId');
    const petName = localStorage.getItem('enquiryPetName');
    if(enquiryUserId, petName){
      setInputMessage(`Hi, I want to adopt ${petName}`);
      setChatUser({userId: enquiryUserId, userName:"Enquiry Charity"})
      localStorage.removeItem('enquiryUserId');
      localStorage.removeItem('enquiryPetName');
    }
  }, []);

  useEffect(() => { 
    if(!loading){
      axios.get(`/chat/userlist`)
      .then(function (response) {
        setUserList(response.data.data.users);
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [loading, chatFetchKey]);

  useEffect(() => { 
    if(chatUser.userId){
      axios.get(`/chat`, {params: {chatUser: chatUser.userId}})
      .then(function (response) {
        setChat(response.data.data.chats);  
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [chatUser, chatFetchKey]);

  useEffect(()=>{
    scrollRef.current.scrollIntoView({ behaviour: "smooth" });
  }, [chat])

  const sendChat = () => {
    if(inputMessage.length){
      axios.post(`/chat`, {userTo:chatUser.userId, message:inputMessage} )
      .then(function (response) {
        setInputMessage("");
        setChatFetchKey(chatFetchKey+1);
      })
      .catch(error => {
        console.error(error);
      });
    }
  }

  const deleteChat = (id) => {
    axios.delete(`/chat/${id}`)
    .then(function (response) {
      setChatFetchKey(chatFetchKey+1);
    })
    .catch(error => {
      console.error(error);
    });
  }

  const keyPress = (e) => {
    if(e.keyCode == 13){
      sendChat()
    }
  }

  return (
      <div>
        <Grid container component={Paper} sx={{width: '100%', height: '90vh'}}>
            <Grid item xs={3} sx={{borderRight: '1px solid #e0e0e0'}}>
                <List>
                {
                  user && !loading &&
                  <ListItem key={user.id}>
                    <ListItemIcon>
                      <Avatar {...stringAvatar(user.name)} />
                    </ListItemIcon>
                    <ListItemText primary={user.name}></ListItemText>
                  </ListItem>
                }
                </List>
                <Divider />
                <List>
                  {
                    userList && userList.map((u)=>(
                        <ListItem button key={u.userId} onClick={(e)=>{setChatUser(u); setInputMessage(""); }}>
                          <ListItemIcon>
                            <Avatar {...stringAvatar(u.userName)} />
                          </ListItemIcon>
                          <ListItemText primary={u.userName}></ListItemText>
                        </ListItem>
                    ))
                  }
                </List>
            </Grid>
            <Grid item xs={9}>
                <List>
                {
                  chatUser.userId && 
                  <ListItem>
                    <ListItemText primary={chatUser.userName}></ListItemText>
                  </ListItem>
                }
                </List>
                <Divider />
                <List sx={{height:'70vh', overflowY:"auto"}}>
                    {
                      chat && chat.map((c,key)=>(
                        <ListItem key={key}>
                          <Grid container>
                              <Grid item xs={12}>
                                  <ListItemText align={c.user_from===user.userId ? 'right' : 'left'} primary={c.message} secondary={formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}></ListItemText>
                                  {
                                    (user.role === 'admin' || user.role === 'charity') &&
                                    <ListItemText sx={{cursor:'pointer'}} align={c.user_from===user.userId ? 'right' : 'left'} onClick={(e)=>{deleteChat(c.id)}}
                                    primary={<Typography variant="body2" style={{ color: 'red', fontSize: 12 }}>Delete</Typography>}></ListItemText>
                                  }
                              </Grid>
                          </Grid>
                      </ListItem>
                      ))
                    }
                    <div ref={scrollRef}/>
                </List>
                <Divider />
                <Grid container style={{padding: '20px'}}>
                    <Grid item xs={11}>
                        <TextField onKeyDown={keyPress} id="outlined-basic-email" label="Message" disabled={!chatUser.userId} value={inputMessage} onChange={(e)=>{setInputMessage(e.target.value)}} fullWidth />
                    </Grid>
                    <Grid xs={1} align="right">
                        <Fab color="primary" aria-label="add" onClick={sendChat}><SendIcon/></Fab>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
      </div>
  );
}