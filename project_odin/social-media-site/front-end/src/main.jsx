import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router"

import LoginAndRegister from './components/LoginAndRegister'
import Profile from './components/Profile'
import Explore from './components/Explore'
import Feed from './components/Feed'
import NewPost from './components/NewPost'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      //{ index: true, element: <DefaultProfile /> },
      { path: "login", element: <LoginAndRegister isLogin={true} /> },
      { path: "register", element: <LoginAndRegister isLogin={false} /> },
      { path: "profile/:requestedUserId", element: <Profile /> },
      { path: "explore", element: <Explore /> },
      { path: "feed", element: <Feed /> },
      { path: "new-post", element: <NewPost /> },
      //{ path: "popeye", element: <Popeye /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
