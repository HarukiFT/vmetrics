import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './components/App/App';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import SignUp from './components/SignUp/SignUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignIn from './components/SignIn/SignIn';
import { AuthContextProvider } from './contexts/AuthContext/AuthContext';
import Projects from './components/Projects/Projects';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<App/>}>
    <Route path="register" element={<SignUp/>}/>
    <Route path="login" element={<SignIn/>}/>
    <Route path="projects" element={<Projects/>}/>
  </Route>
))

root.render(
  <>
    <AuthContextProvider>
      <RouterProvider router={router}/>
      <ToastContainer theme='dark'/>
    </AuthContextProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
