import { Navigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode"
const LoggedIn = () =>{
    const token = localStorage.getItem('token')
    if (!token){
      return false;
    }
    try {
      const decoded = jwtDecode(token);
      console.log(decoded)
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false
    }
  }

  const AllowAuthUser = (comp) =>{
    return LoggedIn() ? comp: <Navigate to="/login" replace/>
  }
  const DenyAuthUser = (comp) =>{
    return !LoggedIn() ? comp: <Navigate to="/dashboard" replace/>
  }
  


export {LoggedIn, AllowAuthUser, DenyAuthUser};