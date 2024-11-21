import React, { useState } from "react";
import axios from "axios";
import Loading from "./Loading"

const apiUrl = import.meta.env.VITE_API_URL;

function Login() {
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("");
  const { emailOrUsername, password } = formData;''

  const onSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Clear any previous error messages
    setLoading(true)
    if (!emailOrUsername || !password) {
      setError("Email/Username and Password are required");
      return;
    }

    try {
      console.log("Attempting login...");
      const response = await axios.post(`${apiUrl}/api/auth/login`, formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Login success", response.data);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage); // Display the error to the user
      console.error(errorMessage);
    }finally{
      setLoading(false)
    }


    if(loading){
      return <Loading />
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmit}>
        <h2>Welcome Back</h2>
        <p className="text-text text-base text-opacity-60 pb-5">
          Login to your Payvia account
        </p>

        {/* Error Message */}
        {error && <p className="error-message text-red-500">{error}</p>}

        {/* Email/Username Input */}
        <div className="form-group">
          <label>Email or Username</label>
          <input
            required
            type="text"
            placeholder="Enter your Email or Username"
            value={emailOrUsername}
            onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
          />
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label>Password</label>
          <input
            required
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Login
        </button>

        {/* Links */}
        <h3 className="text-primary cursor-pointer text-center py-2 hover:text-Accent">
          <a href="/forgot-password">Forget Password?</a>
        </h3>
        <h3 className="text-center text-opacity-75">
          Don't have an account?{" "}
          <span className="text-primary cursor-pointer">
            <a href="/signup">Sign Up</a>
          </span>
        </h3>
      </form>
    </div>
  );
}

export default Login;
