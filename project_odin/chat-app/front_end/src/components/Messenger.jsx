import { useState, useEffect } from 'react'
import { useOutletContext } from "react-router-dom";
import styles from "./Messenger.module.css";


function Messenger() {
  const { authToken, setAuthToken } = useOutletContext();
    const[ user, setUser ] = useState(null);
    const[ lastMessages, setLastMessages ] = useState(null);
    const[ chatMessages, setChatMessages ] = useState(null);

  useEffect(() => {
    if (!authToken) return;
        const fetchUser = async () => {
            const data = await getUser(authToken);
            setUser(data);
        };

        const fetchDialogs= async (userId) => {
            const data = await getChats(authToken, userId, setLastMessages);
            
        };

        fetchUser();
        fetchDialogs();
        
        
    }, []);

  return (
    <>
        <div >
            <h1>MESSENGER</h1>
        </div>


        <div><h3>Create new dialog</h3>
            <form onSubmit={(e) => handleNewChat(e, user.id, authToken) }>
              <input type="text" name="recepientNames" placeholder='user name' required />
              <input type="text" name="text" placeholder='message' required />
              <button type="submit">Send</button>
            </form>

                <br /><br /><br />
        </div>


        {lastMessages && lastMessages.map(message => 
            <div onClick={() => onChatClicked(message.chat, authToken, setChatMessages)}> 
                <span>CHATID: {message.chat}</span> <br />
                <span>{message.text}</span>
            </div>   
        )}
        <br /><br />

        {chatMessages && chatMessages.map(message => 
        <div> 
            <span>user:{message.sender}    {message.text}. </span>

                {message.fileName != "" &&  <><img src={message.imageSrc} alt="" /></>}
               

         </div>   
        )}

        {   chatMessages && 
            <form onSubmit={(e) => handleNewMessage(e, chatMessages[0].chat, user.id, authToken) }>
              <input type="text" name="text" required />
              <input name="picture" type="file" />
              <button type="submit">Send</button>
            </form>
        }

    </>
  )
}

export default Messenger

async function getUser(authToken){
  //console.log("Getting user for token: ", authToken);

  const res = await fetch("http://localhost:3000/user", {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`}
    });

    //console.log("TOKEN SENT===" + authToken + "===")

    const data = await res.json();

    return data;
    //console.log("DATA IS:", data);

}

async function getChats(authToken, userId, setLastMessages) {
    const res = await fetch("http://localhost:3000/messenger", {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`}
    });

    const data = await res.json();
    //console.log("RECEIVED DATA: ", data);

    setLastMessages(data);
}

async function onChatClicked(chatId, authToken, setChatMessages){
    //console.log(chatId, " CLICKED!");

     const res = await fetch("http://localhost:3000/messenger/" + chatId, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`}
    });

    const data = await res.json();

    for (const message of data) {
      if (message.fileName !== "") {
        const imageSrc = await getImageSrc(message.filePath, authToken);
        message.imageSrc = imageSrc;
      }
    }

    //console.log("RECEIVED DATA: ", data);
    setChatMessages(data);
}

const handleNewMessage = async (e, chatId, sender, authToken) => {
  e.preventDefault();

  const formData = new FormData();

    formData.append("text", e.target.text.value);
    formData.append("chatId", chatId);
    formData.append("sender", sender);

    if (e.target.picture.files[0]) {
    formData.append("picture", e.target.picture.files[0]);
    }

    const response = await fetch("http://localhost:3000/message", {
    method: "POST",
    headers: {
        Authorization: `Bearer ${authToken}`, 
    },
    body: formData,
    });
  
};

async function handleNewChat(e, sender, authToken){
  e.preventDefault();

  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`},
    body: JSON.stringify({
      recepientNames: e.target.recepientNames.value,
      sender: sender,
      text: e.target.text.value,
    }),
  });

  //const data = await response.json();
};


async function getImageSrc(path, authToken){
  const imageUrl = `http://localhost:3000/chat/image/${path}`;

  const response = await fetch(imageUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  
  const blob = await response.blob();
  const imageSrc = URL.createObjectURL(blob);

  //console.log("IMAGESRC IS: ", imageSrc);

  return imageSrc;
}