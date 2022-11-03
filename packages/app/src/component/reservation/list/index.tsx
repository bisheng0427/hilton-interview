import { useQuery } from '@apollo/client'
import { Card, List, PageHeader, message, Button, DatePicker, Select } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { EditOutlined } from '@ant-design/icons'
import { useCookies } from 'react-cookie'
import moment from 'moment'
import { useEffect, useState } from 'react'

import { GET_RESERVATION_LIST } from '../../../api/reservation.graphql'
import './index.css'

const { RangePicker } = DatePicker

const ReservationList = (props: any) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [cookies] = useCookies(['guestId'])
  const [filters, updateFilters] = useState({
    page: 1,
    take: 20,
    startDate: '',
    endDate: '',
    status: '',
    guestId: cookies.guestId,
  })
  const { data, error, refetch } = useQuery(GET_RESERVATION_LIST, {
    variables: {
      params: filters,
    },
    notifyOnNetworkStatusChange: true,
  })
  if (error) message.error(error.message)

  const handleEdit = (item: any) => {
    navigate(`/${String(props.role).toLowerCase()}/management/reservation`, {
      state: {
        ...item,
      },
    })
  }

  const dateFilter = async (dates: any) => {
    const newFilters = {
      ...filters,
      startDate: moment(dates[0]).format('YYYY-MM-DD'),
      endDate: moment(dates[1]).format('YYYY-MM-DD'),
    }
    await refetch({
      params: newFilters,
    })
    updateFilters(newFilters)
  }

  const statusFilter = async (value: any) => {
    await refetch({
      params: {
        ...filters,
        status: value,
      },
    })
  }

  useEffect(() => {
    refetch({
      params: filters,
    })
  }, [location.state?.refetch])

  return (
    <>
      <PageHeader className="site-page-header" title={`Reservation Management(${props.role})`} subTitle="Overview" />
      <Button className="create-reservation-btn" type="primary" onClick={handleEdit}>
        + New
      </Button>
      <RangePicker onChange={dateFilter} />
      <Select
        defaultValue=""
        style={{ width: 120 }}
        onChange={statusFilter}
        options={[
          {
            value: 'tbd',
            label: 'To Be Confirmed',
          },
          {
            value: 'completed',
            label: 'Completed',
          },
          {
            value: 'canceled',
            label: 'Canceled',
          },
        ]}
      />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        className="reservation-list"
        dataSource={data?.reservations}
        renderItem={(item: any) => (
          <List.Item>
            <Card actions={[<EditOutlined id={item.id} key="edit" onClick={handleEdit.bind(this, item)} />]}>
              <div>
                <p>
                  <b>Customer Name：</b>
                  {`${item.firstName} ${item.lastName}`}
                </p>
                <p>
                  <b>Arrival Time：</b>
                  {item.arrivalTime}
                </p>
                <p>
                  <b>Table Size：</b>
                  {item.tableSize}
                </p>
                <p>
                  <b>Status：</b>
                  {item.status}
                </p>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </>
  )
}

export default ReservationList
