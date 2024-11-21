import axios from "axios";
import React, {useState} from "react";
import Loading from "./Loading";





const apiUrl = import.meta.env.VITE_API_URL;

function Signup(){
    const [user, setUser]=useState({name:'',email:'',username:'',phoneNumber:'', password:'',})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const {name, username, email, password, phoneNumber} = user
    const onSubmit = async(e)=>{
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const response = await axios.post(`${apiUrl}/api/auth/`, user);
            console.log(response)
            window.location.href=('/login');
        } catch (error) {
            const errorMessage=error.response?.data?.error || "Sign Up failed"
            console.log(errorMessage)
            setError(errorMessage)
        }finally{
            setLoading(false)
        }


        if(loading){
            return <Loading />
          }
    }

    return(
        <div>
            <form  className="p-5 bg-secondary" onSubmit={onSubmit}>
            <div>
                <h2>Create your Payvia Account</h2>
                <p className="text-Accent">Join the Payvia community</p>
                {error && <p className="error-message text-red-500">{error}</p>}
                <div className="block">
                    <label>Name </label>
                    <input required placeholder="Enter your name" value={name} onChange={(e)=>setUser({...user, name: e.target.value})}/>
                </div>
                <div className="block">
                    <label>Email </label>
                    <input required placeholder="Enter your Email address" value={email} onChange={(e)=>setUser({...user, email: e.target.value})}/>
                </div>
                <div className="block">
                    <label>Userame </label>
                    <input required placeholder="Enter your username" value={username} onChange={(e)=>setUser({...user, username: e.target.value})}/>
                </div>
                <div className="block">
                    <label>Phone Number </label>
                    <input required placeholder="Enter your phone number" value={phoneNumber} onChange={(e)=>setUser({...user, phoneNumber: e.target.value})}/>
                </div>
                <div className="block">
                    <label>Password </label>
                    <input type="password" required placeholder="Create a password" value={password} onChange={(e)=>setUser({...user, password: e.target.value})}/>
                </div>
            <div className="flex">
                <input type="checkbox" required className="w-3 mr-2"/>
                <label className="text-opacity-80">Accept Terms and Condition</label>
            </div>
                {/* Social Login: Google, Facebook etc */}
                <button className="submit-button">Register</button>
            </div>
        </form>
        </div>
    )
}
export default Signup;