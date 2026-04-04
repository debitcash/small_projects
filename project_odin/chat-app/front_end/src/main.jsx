import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router";

import Profile from './components/Profile.jsx'
import Messenger from './components/Messenger.jsx'
import Register from './components/Register.jsx'
import Auth from './components/Auth.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "profile", element: <Profile /> },
      { path: "messenger", element: <Messenger /> },
      { path: "register", element: <Register /> },
      { path: "auth", element: <Auth /> }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
