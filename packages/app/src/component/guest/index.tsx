import { useLocation } from 'react-router-dom'
import ReservationList from '../reservation/list'

import './index.css'

const GuestApp = () => {
  const location = useLocation()
  return (
    <>
      <ReservationList refetch={location.state?.refetch} role="Guest" create={true} />
    </>
  )
}

export default GuestApp
