import React from 'react';
import ReactDOM from 'react-dom/client';
import {Layout} from 'antd'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css';
import AuthApp from './component/auth';
import EmployeeApp from './component/employee'
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const { Header, Content } = Layout;
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthApp />,
  },
  {
    path: "/employee/management",
    element: <EmployeeApp />,
  }
]);
root.render(
  <React.StrictMode>
    <Layout>
      <Header className='header'>Resturant Reservation System</Header>
      <Content className='content'>
        <RouterProvider router={router} />
      </Content>
    </Layout>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
