import { useState, useEffect } from 'react'
import { useParams, useOutletContext } from "react-router"

import './Feed.css'

import defaultAvatar from '/src/assets/default-avatar.svg'
import dotsHorizontal from '/src/assets/dots-horizontal.svg'
import comment from '/src/assets/comment.svg'
import defaultImage from '/src/assets/default-image.jpg' 
import verticalImage from '/src/assets/vertical-image.jpg' 
import chevronRight from '/src/assets/chevron-right.svg' 
import heart from '/src/assets/heart.svg'
import filledHeart from '/src/assets/filledHeart.svg'
import Header from './Header'



function Feed({}) {
  const [ allPosts, setAllPosts] = useState([]);

  const { authToken, setAuthToken, currentUser, setCurrentUser } = useOutletContext();

  useEffect(() => {
    fetchPosts(currentUser.id, authToken, setAllPosts)
  }, []);

  return (
    <>
    <Header currentUser={currentUser}/>

    {allPosts && allPosts.map(post =>
        <div className="bigPostsContainer">
            <div className="bigPost">
                <div className="bigPostHeader">
                    <div>
                        <img src={"http://localhost:3000/" + post.user.picture} alt="" />
                        <span>@{post.user.username}</span>
                    </div>
                    <img src={dotsHorizontal} alt="" />
                </div>
                
                {post.image && <img src={"http://localhost:3000/uploads/" + post.image} alt="" />}

                <p>{post.text}</p>

                <div className="bigPostStats">
                    <div>
                        <img src={post && post.likedBy.includes(currentUser.id) ? filledHeart : heart} alt="" onClick={(e) => handleLikeClick(e, post.id, authToken, allPosts, setAllPosts, post.user_id)}/>                       
                        <span>{post.likedBy && post.likedBy.length}</span>
                        <img src={comment} alt="" />
                        <span>4125</span>
                    </div>
                    <span>{post.created_at.substring(0, 10)}</span>
                </div>

                <div className="bigPostComments">

                    {post.comments && post.comments.map(comment => <>
                        <div className="bigPostComment">
                        <div>
                            <span>@{comment.commentor.username}</span>
                            <span>{comment.created_at.substring(0, 10)}</span>
                        </div>

                        <span>{comment.text}</span>
                    </div>
                    </>
                    )}

                    <span >MORE COMMENTS...</span>
                </div>

                <form onSubmit={e => {submitNewComment(e, authToken, currentUser, post.id, setAllPosts)}}>
                    <input type="text" placeholder='WRITE A COMMENT...' name="text"/>
                    <button>POST</button>    
                </form>
            </div>

        </div>
    )}
    </>
  )
}

export default Feed;

async function fetchPosts(userId, authToken, setAllPosts){
    //console.log("Fetching posts!");
    
    const res = await fetch("http://localhost:3000/feed/" + userId, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`}
    });

    const data = await res.json();
    //console.log("Received posts: ", data);
    setAllPosts(data);
    //setPostsDisplayed(data.firstTwoPosts);
}

async function handleLikeClick(e, postId, authToken, postsDisplayed, setPostsDisplayed, profileId) {
    //console.log("Clicked on like!");
    await fetch("http://localhost:3000/like/" + postId + "?count=" + postsDisplayed.length
        + "&profileId=" + profileId, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`}
    });

    const res = await fetch("http://localhost:3000/feed/" + profileId, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${authToken}`}
    });
    
    const data = await res.json();
    //console.log("Received posts: ", data);

    setPostsDisplayed(data);
}

async function submitNewComment(e, authToken, currentUser, postId, setAllPosts) {
    console.log("SENDING! FORM DATA");
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("user_id", currentUser.id);
    formData.append("post_id", postId);

    try {
        const res = await fetch("http://localhost:3000/newcomment/", {
            method: "POST",
            body: formData,
            headers: { "Authorization":`Bearer ${authToken}`}
        });

        const data = await res.json();
        setAllPosts(data);
        //console.log("UPDATED TO: ", data);
    } 
    catch (err) {
        console.error(err);
    }

}