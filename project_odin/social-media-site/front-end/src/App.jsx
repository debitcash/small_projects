import { useState } from 'react'
import './App.css'
import { Outlet } from "react-router";

function App() {
  const [count, setCount] = useState(0);
  const [authToken, setAuthToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
   

  return (
    <>
       <Outlet context={{authToken, setAuthToken, currentUser, setCurrentUser}}/>
    </>
  )
}

export default App
