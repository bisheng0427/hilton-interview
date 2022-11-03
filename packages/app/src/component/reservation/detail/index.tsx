import { Form, Input, Button, DatePicker, Select, message, PageHeader } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import moment from 'moment'
import { useCookies } from 'react-cookie'

import { CREATE_RESERVATION, UPDATE_RESERVATION, GET_RESERVATION_LIST } from '../../../api/reservation.graphql'

import './index.css'

const ReservationDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [cookies] = useCookies(['guestId', 'role'])
  const [addReservation] = useMutation(CREATE_RESERVATION)
  const [updateReservation] = useMutation(UPDATE_RESERVATION)
  let state = location.state || {}
  let flag = 'Create'
  if (state && state.id) flag = 'Edit'

  const { id, firstName, lastName, arrivalTime, tableSize, status } = state

  const onFinish = async (value: any) => {
    const { arrivalTime, tableSize, status } = value
    switch (flag) {
      case 'Create': {
        try {
          await addReservation({
            variables: { guestId: cookies.guestId, arrivalTime: moment(arrivalTime).format('YYYY-MM-DD'), tableSize: Number(tableSize) },
          })
          message.success('Create Reservation Success! Redirecting...')
          setTimeout(() => {
            goBack()
          }, 500)
        } catch (error) {
          message.error(`Create Reservation Failed, error is: ${error}`)
        }
        break
      }
      case 'Edit':
        try {
          await updateReservation({
            variables: {
              reservation: {
                id,
                arrivalTime: arrivalTime && moment(arrivalTime).format('YYYY-MM-DD'),
                tableSize: tableSize && Number(tableSize),
                status: status,
              },
            },
          })
          message.success('Edit Reservation Success! Redirecting...')
          setTimeout(() => {
            goBack()
          }, 500)
        } catch (error) {
          message.error(`Edit Reservation Failed, error is: ${error}`)
        }

        break
    }
  }

  const goBack = () => {
    if (cookies.role === 'guest') {
      navigate('/guest/management', {
        state: { refetch: true },
      })
    } else {
      navigate('/employee/management', {
        state: { refetch: true },
      })
    }
  }

  return (
    <>
      <PageHeader className="site-page-header" onBack={goBack} title={`Reservation Management`} subTitle={flag} />
      <Form className="reservation-form" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} onFinish={onFinish} layout="horizontal" disabled={false}>
        {flag === 'Edit' && (
          <>
            <Form.Item label="Reservation ID" name="id">
              <Input disabled defaultValue={id} />
            </Form.Item>
            <Form.Item label="Customer Name" name="customerName">
              <Input disabled defaultValue={`${firstName} ${lastName}`} />
            </Form.Item>
          </>
        )}

        <Form.Item label="Table Size" name="tableSize">
          <Input width={60} defaultValue={tableSize} value={tableSize} />
        </Form.Item>
        <Form.Item label="Arrival Time" name="arrivalTime">
          <DatePicker defaultValue={moment(arrivalTime || moment(), 'YYYY-MM-DD')} value={moment(arrivalTime, 'YYYY-MM-DD')} />
        </Form.Item>
        {flag === 'Edit' && (
          <Form.Item label="Status" name="status">
            <Select
              style={{ width: 120 }}
              defaultValue={status}
              value={status}
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
          </Form.Item>
        )}
        <Form.Item wrapperCol={{ offset: 10, span: 4 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button type="ghost" onClick={goBack}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default ReservationDetail
