import './App.css';
import PetGrid from './component/PetGrid';
import Login from './component/Login';
import SignupCode from './component/SignupCode';
import Header from './component/Header';
import SignUp from './component/SignUp';
import User from './component/User';
import { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, redirect, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getToken, setToken, setUser, getUser } from './redux/PetReducer';
import axios from 'axios';

let finish = false;

function App() {
  const token = useSelector(getToken);
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log(token);
    if(token){
      axios.defaults.headers.common['Authorization'] = "Bearer "+ token;
      axios.get('/user/verify').then((response)=>{
        //console.log(response.data);
        const { role, userId, username, name } = response.data.data
        dispatch(setUser({role:role, userId:userId, username:username, name:name}));
        finish = true;
      })
      .catch((error) => {
        localStorage.removeItem('token');
        dispatch(setToken(null));
        console.log(error);
      })
    }
    else{
      delete axios.defaults.headers.common['Authorization'];
      dispatch(setUser({}));
    }
  }, [token]);


  return (
    <div className="App">
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<PetGrid/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/signup-code" element={
            <PrivateRoute role={['admin']}>
              <SignupCode/>
            </PrivateRoute>}/>
          <Route path="/user" element={
            <PrivateRoute role={['admin']}>
              <User/>
            </PrivateRoute>}/>

          <Route path="/signup-code" element={<SignupCode/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </Router>
    </div>
  );
}

const PrivateRoute = ({children, role}) => {
  
  const user = useSelector(getUser);
  let auth = false;

  for(let i=0; i<role.length; i++){
    const r = role[i];
    if(r === user.role){
      auth = true;
      break;
    }
  }
  if(!finish)
    return <></>

  if(!auth){
    if(user.role)
      return <Navigate to="/" />  
    else
      return <Navigate to="/login" />  
  }
  else
    return children;
}

export default App;
