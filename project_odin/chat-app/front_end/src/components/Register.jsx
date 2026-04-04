import { useState, useEffect } from 'react'

function Register() {
  
  return (
    <>
        <div>
            <h1>REGISTER</h1>
        </div>
        <div>
            
              <form onSubmit={handleSignup}>
              <input type="text" name="username" placeholder="Username" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit">Sign Up</button>
            </form>
            
        </div>
    </>
  )
}

export default Register

const handleSignup = async (e) => {
  e.preventDefault(); // Prevents the default form submission

  const response = await fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: e.target.username.value,
      password: e.target.password.value,
    }),
  });

  const data = await response.json();
  console.log("Created user:", data);
};