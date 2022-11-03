import { Button, Form, Input, message, Radio, Switch } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import './index.css'

const axios = require('axios').default

const AuthApp: React.FC = () => {
  const navigate = useNavigate()
  const [_, setcookies, removeCookie] = useCookies(['guestId', 'role'])

  removeCookie('guestId')
  removeCookie('role')

  const [form] = Form.useForm()

  const onFinish = async (value: any) => {
    let url = '/auth/employee'
    if (value.type === 'guest') url = '/auth/guest'
    const res = await axios({
      method: 'post',
      url,
      data: {
        email: value.email,
        password: value.password,
      },
    })

    if (res.data.success) {
      setcookies('role', value.type)
      if (value.type === 'guest') {
        setcookies('guestId', res.data.user.loginId)
        navigate('/guest/management', {
          state: res.data.user,
        })
      } else {
        navigate('/employee/management')
      }
    } else {
      message.error(res.data.message)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo)
    console.log('Failed:', errorInfo)
  }

  const fillEmployee = () => {
    form.setFieldsValue({
      email: 'bb@test.com',
      password: '123',
      type: 'employee',
    })
  }

  const fillGuest1 = () => {
    form.setFieldsValue({
      email: '120114531@qq.com',
      password: '123',
      type: 'guest',
    })
  }

  const fillGuest2 = () => {
    form.setFieldsValue({
      email: '120114531@qq.com',
      password: '123',
      type: 'guest',
    })
  }

  return (
    <Form
      name="basic"
      form={form}
      labelCol={{ span: 10 }}
      labelWrap={true}
      wrapperCol={{ span: 4 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item label="Type" name="type">
        <Radio.Group>
          <Radio value="employee"> Employee </Radio>
          <Radio value="guest"> Guest </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 10, span: 4 }}>
        <Button type="link" htmlType="button" onClick={fillEmployee}>
          Fill Employee Data
        </Button>
        <Button type="link" htmlType="button" onClick={fillGuest1}>
          Fill Guest1 Data
        </Button>
        <Button type="link" htmlType="button" onClick={fillGuest2}>
          Fill Guest2 Data
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 10, span: 4 }}>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AuthApp
