import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";

function Auth() {
  const { authToken, setAuthToken } = useOutletContext();

  return (
    <>
        <div>
            <h1>AUTH</h1>
        </div>
        <div>
            
                <form onSubmit={(e) => handleLogin(e, setAuthToken)}>
              <input type="text" name="username" placeholder="Username" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit">Log In</button>
            </form>
            
        </div>
    </>
  )
}

export default Auth


const handleLogin = async (e, setAuthToken) => {
  e.preventDefault(); // Prevents the default form submission

  const response = await fetch("http://localhost:3000/login", {
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
  //console.log("Received token:", data);
  setAuthToken(data);
};