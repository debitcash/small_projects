import { useState, useEffect } from 'react'
import './App.css'
import { Outlet } from "react-router";
import { Link } from "react-router";


function App() {
  const [authToken, setAuthToken] = useState("");



  return (
    <>

      <div>
         <Link to={`messenger`} ><h2>messenger</h2></Link>
          <Link to={`profile`} ><h2>Profile</h2></Link>
        <Link to={`register`} ><h2>Register</h2></Link>
        <Link to={`auth`} ><h2>Auth</h2></Link>
        
      </div>

      <Outlet context={{authToken, setAuthToken}}/>

      


    </>
  )
}

export default App







