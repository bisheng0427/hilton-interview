import React from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from 'antd'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'

import './index.css'
import AuthApp from './component/auth'
import HeaderLayout from './component/header'
import EmployeeApp from './component/employee'
import GusetApp from './component/guest'
import ReservationDetail from './component/reservation/detail'
import reportWebVitals from './reportWebVitals'
import { offsetLimitPagination } from '@apollo/client/utilities'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const { Content } = Layout
const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthApp />,
  },
  {
    path: '/employee/management',
    element: <EmployeeApp />,
  },
  {
    path: '/employee/management/reservation',
    element: <ReservationDetail />,
  },
  {
    path: '/guest/management',
    element: <GusetApp />,
  },
  {
    path: '/guest/management/reservation',
    element: <ReservationDetail />,
  },
])

const client = new ApolloClient({
  uri: 'http://localhost:7001/graphql/',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          reservations: offsetLimitPagination(['startDate', 'endDate', 'status']),
        },
      },
    },
  }),
})

root.render(
  <ApolloProvider client={client}>
    <CookiesProvider>
      <React.StrictMode>
        <Layout>
          <HeaderLayout />
          <Content className="content">
            <RouterProvider router={router} />
          </Content>
        </Layout>
      </React.StrictMode>
    </CookiesProvider>
  </ApolloProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
