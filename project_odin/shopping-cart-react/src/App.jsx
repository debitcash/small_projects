import { useState, useEffect } from 'react'
import { HomeTab } from './components/HomeTab'
import { CartTab } from './components/CartTab'
import { ShopTab } from './components/ShopTab'
import { MainContainer } from './components/MainContainer'
import { createBrowserRouter, RouterProvider, Link } from 'react-router'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainContainer />,
      children:[
        {path:'shop', element: <ShopTab/>},
        {path:'cart', element: <CartTab/>},
        {path:'home', element: <HomeTab/>},
        {index:true, element: <HomeTab/>},
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
