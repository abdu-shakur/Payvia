import React from 'react'

function Header() {
  return (
    <div className='flex justify-between my-2 mx-5 text-primary'>
      <div className='text-xl font-bold cursor-pointer'><a href="/">PAYVIA</a></div>
    
    <nav className='flex space-x-4'>
      <ul className='md:flex md:space-x-4 hidden'>
        <li><a className='cursor-pointer'>Features</a></li>
        <li><a className='cursor-pointer'>About Us</a></li>
      </ul>
      <ul className='flex space-x-4'>
        <li><a href='/login' className='cursor-pointer'>Login</a></li>
        <li><a href='/signup' className='cursor-pointer'>Signup</a></li>
      </ul>
    </nav>
        
    </div>
  )
}

export default Header