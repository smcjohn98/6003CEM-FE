import './App.css';
import PetGrid from './component/PetGrid';
import PetDetail from './component/PetDetail';
import Login from './component/Login';
import SignupCode from './component/SignupCode';
import Header from './component/Header';
import SignUp from './component/SignUp';
import User from './component/User';
import Chat from './component/Chat';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getToken, setToken, setUser, getUser, setLoading, getLoading } from './redux/PetReducer';
import axios from 'axios';

function App() {
  const token = useSelector(getToken);
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log(token);
    if(token){
      dispatch(setLoading(true))
      axios.defaults.headers.common['Authorization'] = "Bearer "+ token;
      axios.get('/user/verify').then((response)=>{
        //console.log(response.data);
        const { role, userId, username, name } = response.data.data
        dispatch(setUser({role:role, userId:userId, username:username, name:name}));
        dispatch(setLoading(false))
        console.log(response.data);
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
      dispatch(setLoading(false))
    }
  }, [token]);


  return (
    <div className="App">
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<PetGrid/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/pet/:id" element={<PetDetail/>} />
          <Route path="/chat" element={
            <PrivateRoute role={['admin', 'charity', 'user']}>
              <Chat/>
            </PrivateRoute>}/>
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
  const loading = useSelector(getLoading);
  let auth = false;

  for(let i=0; i<role.length; i++){
    const r = role[i];
    if(r === user.role){
      auth = true;
      break;
    }
  }
  if(loading)
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
