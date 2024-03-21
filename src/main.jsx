import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import './index.css'
import * as ReactDOM from "react-dom/client";
import paperIndex from './paperIndex'



const router = createBrowserRouter(
//   [
//   {
//     path: "/slm-demo/paper-generation",
//     element: <App examples={examples}/>,
//   },
//   {
//     path: "/slm-demo/paper-resample",
//     element: <App />,
//   }
// ]
Object.keys(paperIndex).map((key) => {
  return {
    path: "/slm-demo/paper-"+key,
    element: <App examples={paperIndex[key]}/>,
  }
})
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
