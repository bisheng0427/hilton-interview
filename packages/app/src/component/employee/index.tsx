import { useLocation } from 'react-router-dom'

import ReservationList from '../reservation/list'

import './index.css'

const EmployeApp = () => {
  const location = useLocation()
  return (
    <>
      <ReservationList refetch={location.state?.refetch} role="Employee" />
    </>
  )
}

export default EmployeApp
