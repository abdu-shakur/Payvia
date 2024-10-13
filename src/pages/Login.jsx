import React, {useState} from "react";
import axios from "axios";
function Login(){
    const [formData, setFormData] = useState({ email: '', password: '' })
    const { email, password } = formData
    const onSubmit = async (event) => {
        event.preventDefault()
         try {
            console.log("reached");
            const response = await axios.post("http://localhost:8000/api/auth/login", formData);
            if (response.data.token){
                localStorage.setItem('token', response.data.token)
            }
            console.log("login success", response.data);
            window.location.href=('/dashboard');

          } catch (error) {
            const errorMessage = error.response?.data?.error || "Login failed";
            console.error(errorMessage);
          }
        }
    

    return(
        <div className="">
            <form  className="" onSubmit={onSubmit}>
                    <h2>Welcome Back</h2>
                    <p className="text-text text-base text-opacity-60 pb-5">Login to your Payvia account</p>
                    <div className="block">
                        <label>Email </label>
                        <input required type="" placeholder="Enter your Email address" value={email} onChange={(e)=>setFormData({...formData, email: e.target.value})}/>
                    </div>
            
                    <div className="block">
                        <label>Password </label>
                        <input required placeholder="Enter your password" type="password" value={password} onChange={(e)=>setFormData({...formData, password: e.target.value})}/>
                    </div>
                    {/* Social Login: Google, Facebook etc */}
                    <button type="submit" className="submit-button">Login</button>
                    <h3 className="text-primary cursor-pointer text-center py-2 hover:text-Accent">Forget Password?</h3>
                    <h3 className="text-center text-opacity-75">Don't have an account? <span className="text-primary cursor-pointer"><a href="/signup">Sign Up</a></span></h3>
            </form>
        </div>
    )
}
export default Login;