import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";

function Profile() {
  const { authToken, setAuthToken } = useOutletContext();
  const[ user, setUser ] = useState(null);

  useEffect(() => {
    if (!authToken) return;

    const fetchUser = async () => {
      //console.log("Calling API with token:", authToken);
      const data = await getUser(authToken);
      setUser(data);
    };

    fetchUser();
  }, []);

  return (
    <>
        <div>
            <h1>PROFILE</h1>
        </div>
        <div>
                { user && 
                  <>
                    <form onSubmit={(e) => handleSubmit(e, user.id, authToken)}>
                        <span>Name: {user.username}</span> <br />
                        <span>Password: {user.password}</span> <br />
                        <span>{user.picture}</span> <br />

                        <input name="username" placeholder={user.username} />
                        <input name="password" type="password" placeholder={user.password} />
                        <input name="picture" type="file" />
                        <button type="submit">Update</button>

                        <img src={"http://localhost:3000/" + user.picture} alt="profileImage" />

                    </form>
                  </>
                }
        </div>
    </>
  )
}

export default Profile

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

const handleSubmit = async (e, userId, authToken) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const res = await fetch("http://localhost:3000/user/" + userId, {
      method: "POST",
      body: formData,
      headers: { "Authorization":`Bearer ${authToken}`}
    });

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};