import { useState, useEffect } from 'react'
import { useParams, useOutletContext } from "react-router"

import './Profile.css'
import defaultAvatar from '/src/assets/default-avatar.svg'
import dotsHorizontal from '/src/assets/dots-horizontal.svg'
import comment from '/src/assets/comment.svg'
import defaultImage from '/src/assets/default-image.jpg' 
import verticalImage from '/src/assets/vertical-image.jpg' 
import chevronRight from '/src/assets/chevron-right.svg' 
import heart from '/src/assets/heart.svg'
import filledHeart from '/src/assets/filledHeart.svg'
import uploadBox from '/src/assets/upload-box.svg'
import Header from './Header'

function Profile({}) {
    const [ profileButtonState, setProfileButtonState] = useState("");

    const [requestedUser, setRequestedUser] = useState(null);
    const { requestedUserId } = useParams();
    const[ isMorePostsAvailable, setIsMorePostsAvailable ] = useState(true);

    const [postsDisplayed, setPostsDisplayed] = useState(null);

    const { authToken, setAuthToken, currentUser, setCurrentUser } = useOutletContext();

    useEffect(() => {
        fetchProfile(requestedUserId, authToken, setRequestedUser, setPostsDisplayed);

    }, []);

    return (
        <>
            <Header currentUser={currentUser}/>
            { currentUser ?
                <div className="profileContainer">
                    <form onSubmit={(e) => handleUpdateProfileSubmit(e, currentUser.id, authToken, profileButtonState, setProfileButtonState, setRequestedUser)}>
                    <div className="personalInformation">
                        <div className="imageContainer">
                            {currentUser.id == requestedUserId ?
                                (profileButtonState=="EDIT" ? 
                                    <>
                                        <label htmlFor="fileUpload" className="visually-hidden">
                                            <img src={uploadBox} id='updatePictureBox'></img>
                                            Update <br /> avatar
                                        </label>

                                        <input
                                            id="fileUpload"
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => console.log(e.target.files)}
                                            name="newAvatarFile"
                                        />
                                    </>
                                    :
                                    <>
                                        <img src={requestedUser && (!requestedUser.picture ? defaultImage 
                                                : 
                                                "http://localhost:3000/" + requestedUser.picture) } 
                                                 />
                                                
                                        <div className="redAvatarShadow"></div>
                                    </>
                                )
                                :
                                <>
                                    <img src={defaultImage} alt="" />
                                    <div className="redAvatarShadow"></div>
                                </>
                            }
                        </div>
                        <div>
                            {currentUser.id == requestedUserId ?
                                (profileButtonState=="EDIT" ? 
                                    <>
                                    <div className="nameAndEditContainer">
                                        <span>@</span><input type='text' name='newUsername' defaultValue={requestedUser.username}></input> 
                                        <button type="submit" >
                                        SUBMIT CHANGES
                                        </button>
                                    </div>
                                    <textarea name='newProfileDescription' type="textarea" defaultValue="No description to show-off yet :(" id='descriptionInput'/>
                                    </>
                                    :
                                    <>
                                    <div className="nameAndEditContainer">
                                        <h1>@{requestedUser && requestedUser.username}</h1>
                                        <button key="anything" type="button" onClick={(e) => handleProfileButtonClick(e, profileButtonState, setProfileButtonState)}>
                                        EDIT PROFILE
                                        </button>
                                    </div>
                                    <p>{requestedUser && requestedUser.about}</p>
                                    </>
                                )
                            :
                                <>
                                <div className="nameAndEditContainer">
                                    <h1>@{requestedUser && requestedUser.username}</h1>
                                    <button key="anything" type="button" id={profileButtonState=="FOLLOWING" ? "follower" : undefined}
                                        onClick={() => {
                                            console.log("Toggle subscription");
                                            toggleSubscription(profileButtonState, setProfileButtonState);
                                        }}>

                                        {profileButtonState == "FOLLOWING" ? "FOLLOWING" : "SUBSCRIBE"}
                                    </button>
                                </div>
                                <p>{requestedUser && requestedUser.about ? requestedUser.about : "No description to show-off yet :("}</p>
                                </>
                            }
                            <div className="allStats">
                                <div className="statsContainer">
                                    <span>POSTS</span>
                                    <span>{requestedUser && requestedUser.posts}</span>
                                </div>
                                <div className="statsContainer">
                                    <span>FOLLOWERS</span>
                                    <span>{requestedUser && requestedUser.followers}</span>
                                </div>
                                <div className="statsContainer">
                                    <span>FOLLOWING</span>
                                    <span>{requestedUser && requestedUser.following}</span>
                                </div>
                                <div className="statsContainer">
                                    <span>LIKES</span>
                                    <span>{requestedUser ? requestedUser.likes : 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </form>
                    <div className="posts">
                        
                        {postsDisplayed && postsDisplayed.map(post =>
                             <>
                                <div className="post">
                                    <div className="postHeader">
                                        <span>@{requestedUser.username}</span>
                                        <img src={dotsHorizontal} alt="" />
                                    </div>

                                    {post.image && <>
                                        <div className='postImage'>
                                            <img src={"http://localhost:3000/" + "uploads/" + post.image} alt="" />
                                        </div>
                                    </>}
                                    
                                    <div className="extraPostInfo">
                                        <p>{post.text}</p>
                                        <div>
                                            <div className="postStatsImages">
                                                <img src={post && post.likedBy.includes(currentUser.id) ? filledHeart : heart} alt="" onClick={e => handleLikeClick(e, post.id, authToken, postsDisplayed, setPostsDisplayed, requestedUser.id)}/>
                                                <span>{post.likedBy.length}</span>
                                                <img src={comment} alt="" />
                                                <span>22</span>
                                            </div>
                                            <span>2 DAYS AGO</span>
                                        </div>
                                    </div>
                                </div>
                             </>
                            )
                        }
                        {isMorePostsAvailable &&
                            <div className="post morePersonalPosts" onClick={(e) => onMorePostsRequested(e, requestedUserId, postsDisplayed, setPostsDisplayed, authToken, setIsMorePostsAvailable)}>
                                <span>MORE</span>
                                <img src={chevronRight} alt="" />
                            </div>
                        }
                    </div>
                </div>
            :
                <h1>You Must be signed in to view this page!</h1>
            }
        </>
    )
}

export default Profile;

async function fetchProfile(userId, authToken, setRequestedUser, setPostsDisplayed){
    const res = await fetch("http://localhost:3000/profile/" + userId, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`}
    });

    const data = await res.json();
    //console.log("Received first two: ", data.firstTwoPosts);
    setRequestedUser(data.user);
    setPostsDisplayed(data.firstTwoPosts);
}

function handleProfileButtonClick(e, profileButtonState, setProfileButtonState){
    /*if editingProfile{

    }
    else{

    }*/
   //console.log('ONSUBMIT', e);

    profileButtonState == "EDIT" ? setProfileButtonState("SUBMIT") : setProfileButtonState("EDIT");


}

function toggleSubscription(profileButtonState, setProfileButtonState){
    if (profileButtonState == "FOLLOWING"){
        setProfileButtonState("SUBSCRIBE");
    }
    else{
        setProfileButtonState("FOLLOWING");
    }
}

async function handleUpdateProfileSubmit(e, userId, authToken, profileButtonState, setProfileButtonState, setRequestedUser){
    //console.log("SENDING! FORM DATA");
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const res = await fetch("http://localhost:3000/user/" + userId, {
            method: "POST",
            body: formData,
            headers: { "Authorization":`Bearer ${authToken}`}
        });

        const data = await res.json();
        setRequestedUser(data);
        console.log("UPDATED TO: ", data);
    } 
    catch (err) {
        console.error(err);
    }

    

    profileButtonState == "EDIT" ? setProfileButtonState("SUBMIT") : setProfileButtonState("EDIT");
}

async function onMorePostsRequested(e, requestedUserId, postsDisplayed, setPostsDisplayed, authToken, setIsMorePostsAvailable){
    //console.log(postsDisplayed)
    const res = await fetch("http://localhost:3000/posts/" + requestedUserId + "?count=" + postsDisplayed.length, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`}
    });
    
    const data = await res.json();

    //console.log("Received posts: ", data);

    if (data.length == postsDisplayed.length){
        setIsMorePostsAvailable(false);
    }

    setPostsDisplayed(data);
}

async function handleLikeClick(e, postId,authToken, postsDisplayed, setPostsDisplayed, profileId) {
    //console.log("Clicked on like!");
    const res = await fetch("http://localhost:3000/like/" + postId + "?count=" + postsDisplayed.length
        + "&profileId=" + profileId, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`}
    });
    
    const data = await res.json();
    //console.log("Received posts: ", data);

    setPostsDisplayed(data);
}