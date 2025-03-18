import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import { Toaster } from "sonner"

const appRouter= createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/signup",
    element: <Signup/>,
  }
])

const App = () => {
  return (
    <>
        <RouterProvider router={appRouter}/>
        <Toaster position="top-center" richColors />
    </>
  )
}

export default App