import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter} from "react-router-dom";
import {RouterProvider} from "react-router";
import Register from "./register.tsx";
import Posts from "./Posts.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "",
                element: <Posts />
            }
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
          <RouterProvider router={router} />
  </React.StrictMode>,
)
