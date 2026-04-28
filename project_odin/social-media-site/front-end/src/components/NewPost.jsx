import { useState, useEffect } from 'react'
import { useParams, useOutletContext } from "react-router"
import './NewPost.css'

import defaultAvatar from '/src/assets/default-avatar.svg'
import dotsHorizontal from '/src/assets/dots-horizontal.svg'
import comment from '/src/assets/comment.svg'
import defaultImage from '/src/assets/default-image.jpg' 
import verticalImage from '/src/assets/vertical-image.jpg' 
import chevronRight from '/src/assets/chevron-right.svg' 

import uploadBoximage from '/src/assets/upload-box.svg' 
import sendImage from '/src/assets/send.svg' 

import heart from '/src/assets/heart.svg'
import Header from './Header'



function NewPost({}) {
  const [onLogin, setOnLogin] = useState();
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");

  const { authToken, setAuthToken, currentUser, setCurrentUser } = useOutletContext();

  useEffect(() => {
    //console.log(onLogin);
  }, []);

  return (
    <>
    <Header currentUser={currentUser}/>
    <div className="newPostMainContainer">
        <h1>CREATE NEW POST</h1>
        <form className="newpost"
        onSubmit={(e) => handleUpdateProfileSubmit(e, currentUser.id, authToken)}>

            <div>
                <span>POST TEXT</span>
                <textarea id="message" name="message" placeholder='Type in here'></textarea>
            </div>
            <div>
                <span>POST IMAGE</span>
                <label for="image_uploads">
                    <img src={uploadBoximage} alt="" />Choose images to upload (PNG, JPG)
                </label>
                <input type="file" id="image_uploads" name="image" hidden/>
            </div>
            <button type='submit'>
                <img src={sendImage} alt="" />
                POST
            </button>
        </form>
    </div>
    </>
  )
}

export default NewPost;

async function handleUpdateProfileSubmit(e, userId, authToken){
    console.log("SENDING! FORM DATA");
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const res = await fetch("http://localhost:3000/newpost/" + userId, {
            method: "POST",
            body: formData,
            headers: { "Authorization":`Bearer ${authToken}`}
        });

       // const data = await res.json();
        //setRequestedUser(data);
        //console.log("UPDATED TO: ", data);
    } 
    catch (err) {
        console.error(err);
    }

}