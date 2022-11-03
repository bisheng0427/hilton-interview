import { Layout, Button } from 'antd'
import { useCookies } from 'react-cookie'

import './index.css'

const { Header } = Layout

const HeaderLayout = () => {
  const [cookies] = useCookies(['role'])

  const logout = () => {
    window.location.href = '/'
  }
  return (
    <>
      <Header className="header">
        Resturant Reservation System
        {cookies.role && (
          <Button type="link" onClick={logout} danger>
            Logout
          </Button>
        )}
      </Header>
    </>
  )
}

export default HeaderLayout
