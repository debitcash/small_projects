import { useState, useEffect } from 'react'
import { Link } from "react-router";
import './Header.css'

function Profile({currentUser}) {
  const [onLogin, setOnLogin] = useState();
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");

  useEffect(() => {
    //console.log(onLogin);
  }, []);

  return (
    <>
     <div className="header">
        <div className="headerLeft">
            <h1>UNFILTERED</h1>
            <Link to="/feed">FEED</Link>
            <Link to="/explore">EXPLORE</Link>
            <Link to={currentUser ? "/profile/" + currentUser.id : "/profile"}>PROFILE</Link>
        </div>
        <div className="headerRight">
            <form action="">
                <input type="text" placeholder='SEARCH USER'/>
            </form>
            <Link to="/new-post"><button>NEW POST</button></Link>
        </div>
     </div>
    </>
  )
}

export default Profile;
