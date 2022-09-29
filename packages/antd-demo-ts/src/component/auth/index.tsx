import { Button, Form, Input } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'

const axios = require('axios').default;


const AuthApp: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm();

  const onFinish = async (value: any) => {
    const res = await axios({
      method: 'post',
      url: '/api/auth/employee',
      data: {
        email: value.email,
        password: value.password
      }
    });
  
    console.log('Success:', res);
    if (res.data.success) {
      navigate('/employee/management')
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onFill = () => {
    form.setFieldsValue({
      email: 'bb@test.com',
      password: '123',
    });
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
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 10, span: 4 }}>
        <Button type="link" htmlType="button" onClick={onFill}>
        Fill form
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 10, span: 4 }}>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AuthApp;