import { useState, useEffect } from 'react'
import { useParams, useOutletContext } from "react-router"
import './Explore.css'

import defaultAvatar from '/src/assets/default-avatar.svg'
import dotsHorizontal from '/src/assets/dots-horizontal.svg'
import comment from '/src/assets/comment.svg'
import defaultImage from '/src/assets/default-image.jpg' 
import verticalImage from '/src/assets/vertical-image.jpg' 
import chevronRight from '/src/assets/chevron-right.svg' 
import heart from '/src/assets/heart.svg'
import Header from './Header'



function Explore({}) {
  const [displayedUsers, setDisplayedUsers] = useState();

  const { authToken, setAuthToken, currentUser, setCurrentUser } = useOutletContext();

  const [ following, setFollowing] = useState([]);

  useEffect(() => {
    fetchProfiles(authToken, setDisplayedUsers);
    fetchFollowing(authToken, setFollowing);
  }, []);

  return (
    <>
    <Header currentUser={currentUser}/>
    <div className="exploreContainer">
        <h1>EXPLORE</h1>
        <p>Discover and follow people across the network.</p>

        <div className="miniProfiles">
            {displayedUsers && displayedUsers.map(user => <>
                <div className="miniProfile">
                <img src={"http://localhost:3000/" + user.picture} alt="" />
                <span>@{user.username}</span>
                <div className="stats">
                    <div>
                        <span>{user.posts}</span>
                        <span>POSTS</span>
                    </div>
                    <div>
                        <span>{user.likes}</span>
                        <span>LIKES</span>
                    </div>
                    <div>
                        <span>{user.subscribers}</span>
                        <span>SUBS</span>
                    </div>
                </div>
                <button onClick={(e) => toggleSubscription(e, authToken, user.id, setFollowing, setDisplayedUsers)} 
                    className={following.includes(user.id) ? "isFollowing" : ""}
                    >{following.includes(user.id) ? "UNFOLLOW" : "FOLLOW"}</button>
            </div>
            </>)}
        </div>
    </div>
    </>
  )
}

export default Explore;

async function fetchProfiles(authToken, setDisplayedUsers){
    const res = await fetch("http://localhost:3000/profiles/", {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`}
    });

    const data = await res.json();
    //console.log("USERS: ", data);
    setDisplayedUsers(data);

}

async function toggleSubscription(e, authToken, subscribee, setFollowing, setDisplayedUsers){
    //console.log("SUBSCURBIEE ", subscribee);
    const res = await fetch("http://localhost:3000/follow/" + subscribee, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`}
    });

    const data = await res.json();
    setFollowing(data);
    fetchProfiles(authToken, setDisplayedUsers);

    //const data = await res.json();
    //setDisplayedUsers(data);

}

async function fetchFollowing(authToken, setFollowing) {
    const res = await fetch("http://localhost:3000/following/", {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`}
    });

    const data = await res.json();
    //console.log("SETTING FOLLOWING TO: ", data);
    setFollowing(data);
}