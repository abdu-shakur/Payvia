import { Navigate } from 'react-router-dom';
const LoggedIn = () =>{
    const token = localStorage.getItem('token')
    return !!token
  }

  const AllowAuthUser = (comp) =>{
    return LoggedIn() ? comp: <Navigate to="/login" replace/>
  }
  const DenyAuthUser = (comp) =>{
    return !LoggedIn() ? comp: <Navigate to="/dashboard" replace/>
  }
  


export {LoggedIn, AllowAuthUser, DenyAuthUser};