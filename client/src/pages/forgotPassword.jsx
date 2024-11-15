import React from 'react'

function ForgotPassword() {
  return (
    <div className="">
            <form  className="">
                    <h2>Forgot Password</h2>
                    <p className="text-text text-base text-opacity-60 pb-5">Get password reset link</p>
                    <div className="block">
                        <label>Email </label>
                        <input required type="" placeholder="Enter your Email address"/>
                        <button className="submit-button" type="submit">Request Password reset link</button>
                    </div>
            </form>
    </div>
  )
}

export default ForgotPassword;