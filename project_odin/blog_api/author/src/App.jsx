import { useEffect, useState } from 'react'
//import { ScoreContainer } from './components/ScoreContainer.jsx'
//import { CardContainer } from './components/CardContainer.jsx'

function App() {
  const [allPosts, setAllPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [relatedComments, setRelatedComments] = useState([]);

  async function handleClick(){
    console.log("Fetching all posts");

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
        console.log("Received comments: ", data);

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
    
    localStorage.setItem("token", data);
  }

  async function handlePostSubmit(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${localStorage.getItem("token")}`},
      body: JSON.stringify({ title:e.target.title.value, text:e.target.text.value,
        status:e.target.status.value,
       }),
    });

    const data = await res.json();
    setAllPosts(data);
  }

  async function onPublishAction(action, post) {
    if (action == "publish"){
        post.status = "published";

        let res = await fetch("http://localhost:3000/posts", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization":`Bearer ${localStorage.getItem("token")}`},
          body: JSON.stringify(post)
        });

        const data = await res.json();

        setAllPosts(data);
    }

    else{
      post.status = "draft";

      let res = await fetch("http://localhost:3000/posts", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization":`Bearer ${localStorage.getItem("token")}`},
          body: JSON.stringify(post)
        });

        const data = await res.json();

        setAllPosts(data);
    }
  }

  async function updateComment(e, comment){
    e.preventDefault();

    comment.text = e.target.text.value;

    const res = await fetch("http://localhost:3000/comments", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${localStorage.getItem("token")}`},
      body: JSON.stringify(comment),
    });

    const data = await res.json();
    setRelatedComments(data);

  }

  async function deleteComment(comment) {
    const res = await fetch("http://localhost:3000/comments", {
      method: "delete",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${localStorage.getItem("token")}`},
      body: JSON.stringify(comment),
    });

    const data = await res.json();
    console.log("REC", data);
    setRelatedComments(data);
    
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
            <a onClick={() => handleGetSpecificPost(post)}>{post.title}---{post.status}</a>
            <span onClick={() => onPublishAction("publish", post)}>Publish</span>
            
            <span onClick={() => onPublishAction("unpublish", post)}>Unpub</span>
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
                <h4>{comment.created_at}</h4><span>{comment.text}</span>
                <br />
                <span onClick={() => deleteComment(comment) }>DELETE</span>
                <form onSubmit={(e) => updateComment(e, comment)}>
                  <label htmlFor="text">text</label>
                  <input id="text" name="text" placeholder={comment.text} type="text" />
                  <button type="submit">Update</button>
                </form>
              </>)}

            </div>
        </div>
      </>}
    

      <form onSubmit={handlePostSubmit}>
        <label htmlFor="title">title</label>
        <input id="title" name="title" placeholder="title" type="text" />
        <label htmlFor="usernatextme">text</label>
        <input id="text" name="text" placeholder="text" type="text" />
        <label htmlFor="status">status</label>
        <input id="status" name="status" type="status" />
        <button type="submit">Log In</button>
      </form>


    </>
  )
}

export default App
