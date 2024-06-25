import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import App2 from './App2.jsx'
import './index.css'
import * as ReactDOM from "react-dom/client";
import paperIndex from './paperIndex'



const router = createBrowserRouter(
  [
  // {
  //   path: "/slm-demo",
  //   element: <App2/>,
  // },
  {
    path: "/slm-mml-demo",
    element: <App/>,
  }
]
);


ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);
