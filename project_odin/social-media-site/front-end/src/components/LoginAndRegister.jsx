import { useState, useEffect } from 'react'
import { Link } from "react-router"
import { useNavigate } from "react-router-dom";

import './LoginAndRegister.css'
import logoImg from '/src/assets/logo.png'
import githubSvg from '/src/assets/github.svg'
import { useOutletContext } from "react-router-dom";

function LoginAndRegister({isLogin}) {
  const [onLogin, setOnLogin] = useState(isLogin);
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");

  let navigate = useNavigate();

  const { authToken, setAuthToken, currentUser, setCurrentUser } = useOutletContext();

  useEffect(() => {
    //console.log(onLogin);
  }, []);

  return (
    <>
      <main className='mainContainer'>
        <div className='leftContainer'>
            <div>
                <div className="nameContainer">
                    <h1>UNFILTERED</h1>
                    <span>FREEDOM OF SPEECH / SAY ANYTHING</span>
                </div>
                <img src={logoImg} alt="" />
            </div>
        </div>
        <div className='rightContainer'>
            <form action="" className='loginAndRegisterForm' onSubmit={(e) => handleSignup(e, onLogin, setAuthToken, setCurrentUser, navigate)}>
                <div>
                    <h1>
                        {onLogin ? "LOGIN" : "REGISTER" }
                    </h1>
                    <div className='redUnderline'></div>
                </div>
                    <div className="inputContainer">
                        <span>USERNAME</span>
                        <input type="text" name='username' required/>
                    </div>
                    <div className="inputContainer">
                        <span>PASSWORD</span>
                        <input name="password" type="text" value={firstPassword} onChange={(event) => setFirstPassword(event.target.value)} required/>
                    </div>
                    {!onLogin && 
                        <div className="inputContainer">
                            <span>CONFIRM PASSWORD</span>
                            {!(firstPassword == secondPassword) && <span className="passwordsMustMatch">PASSWORDS MUST MATCH</span>}
                            <input className={!(firstPassword == secondPassword) ? "secondPasswordFieldInvalid" : ""} type="text" 
                                value={secondPassword}
                                onChange={(event) => setSecondPassword(event.target.value)} required/>
                        </div>
                    }
                    
                <button type='submit'>{onLogin ? "LOGIN" : "REGISTER"}</button>
            </form>
            
            <div className='githubContainer'>
                <img src={githubSvg} alt="" />
                <a href="">CONTINUE WITH GITHUB</a>
            </div>
            
            <div className='switchContainer'>
                {onLogin ? 
                    <span>Don't have an account?{" "}
                        <Link to="/register" onClick={() => {setOnLogin(false); setFirstPassword(""); setSecondPassword("")}}>Sign Up</Link> 
                    </span>
                    :
                    <span>Already registered?{" "}
                        <Link to="/login" onClick={() => {setOnLogin(true); setFirstPassword(""); setSecondPassword("")}}>Log In</Link> 
                    </span>
                }

            </div>
        </div>
      </main>
    </>
  )
}

export default LoginAndRegister;


async function handleSignup(e, onLogin, setAuthToken, setCurrentUser, navigate){
    e.preventDefault();

    if (onLogin){
        console.log("LOGGING IN!");
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
        //console.log("Received response:", data);
        //console.log("Received token:", data.token);

        setCurrentUser(data.user);
        setAuthToken(data.token);

       // console.log("Navigating to: ", "/profile/" + data.user.id);
        
        navigate("/profile/" + data.user.id);

    }
    else{
        console.log("SIGNING UP!");
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
    }
}