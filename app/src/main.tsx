import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DebtList from './apps/main/DebtList.tsx';
import UserDebtsList from './apps/debtlist/UserDebtsList.tsx';
import RunningApp from './apps/running/RunningApp.tsx';


const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        index: true,
        element: <UserDebtsList />,
      },
      {
        path: ":userId",
        element: <DebtList />,
      },
      {
        path: "running",
        element: <RunningApp />
      }
    ]
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
