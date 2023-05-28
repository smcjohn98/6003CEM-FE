import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Store from './redux/Store';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';

axios.defaults.baseURL = 'http://localhost:5000/api';
//axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json';
//axios.defaults.headers.common['Authorization'] = "Bearer 123124521";

/*axios.interceptors.request.use(request => {
  console.log(request);
  // Edit request config
  return request;
}, error => {
  console.log(error);
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  console.log(response);
  // Edit response config
  return response;
}, error => {
  console.log(error);
  return Promise.reject(error);
});*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={Store}>
    <GoogleOAuthProvider clientId="386098779877-3jsirm35gteoq3dg0ookol528ppobe2c.apps.googleusercontent.com">
      <App />  
    </GoogleOAuthProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
