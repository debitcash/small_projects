import { useEffect, useState } from 'react'
//import { ScoreContainer } from './components/ScoreContainer.jsx'
//import { CardContainer } from './components/CardContainer.jsx'

function App() {
  const [allPosts, setAllPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [relatedComments, setRelatedComments] = useState([]);

  async function handleClick(){
    console.log("Fetching all posts");

    /*fetch('http://localhost:3000/posts')
      .then((res) => res.json())      // convert response to JSON
      .then((data) => {           // your actual JSON
        console.log("Received: ", data);
        setAllPosts(data);
      })
      .catch(function(err) {
        // Error :(
      });*/
    
    //console.log("TOKEN I: S", localStorage.getItem("token"));

    const res = await fetch("http://localhost:3000/posts", {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${localStorage.getItem("token")}`}
    });

    const data = await res.json();

    console.log("DATA IS:", data);
    setAllPosts(data);
  }

  function handleGetSpecificPost(post){
    fetch('http://localhost:3000/comments/' + post.id)
      .then((res) => res.json())      // convert response to JSON
      .then((data) => {           // your actual JSON
        //console.log("Received comments: ", data);
        setRelatedComments(data);
      })
      .catch(function(err) {
        // Error :(
      });

      setSelectedPost(post);
  }

  async function handleSubmit(e){
    e.preventDefault();

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ username:e.target.username.value, password:e.target.password.value }),
    });

    const data = await res.json();
    //console.log("SHOULD BE TOLEN HERE: ", data);

    if (data.message){
      console.log("Wrong password or name");
      return;
    }
    console
    localStorage.setItem("token", data);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" placeholder="username" type="text" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
        <button type="submit">Log In</button>
      </form>


    <button onClick={handleClick}>ALL POSTS</button>

      {
        allPosts.map(post =>
          <>
            <a onClick={() => handleGetSpecificPost(post)}>{post.title}</a>
            <br />
          </>
        )
      }
 
      { selectedPost && <>
        <div style={{display:'flex', gap:'150px'}}>
            <div>
              <h2>Post</h2>
              <h3>{selectedPost.title}</h3><span>{selectedPost.status}</span>
              <h4>{selectedPost.text}</h4>
              <h4>{selectedPost.published_at}</h4>
            </div>
            <div>
              <h2>Comments</h2>
              {relatedComments.map(comment => <>
                <h4>{comment.created_at}</h4><span>{selectedPost.text}</span>
              </>)}

            </div>
        </div>
      </>}
    
    </>
  )
}

export default App
