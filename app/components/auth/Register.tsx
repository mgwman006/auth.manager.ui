import { Button, Col, Divider, Form, Input, notification, Row, Space, Spin } from "antd";
import { ArrowLeftOutlined, LockOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { useAccount } from "../../store/account/AccountContext";
import { useNavigate } from "react-router-dom";
import { AccountCreateDto } from "../../types/types";
import { authApi } from "../../api/api";
import { handleApiError } from "../../utilities/error-handler";
import { useState } from "react";


export default function Refister()
{
    const [form] = Form.useForm();
    const [notificationApi, notificationContextHolder] = notification.useNotification();
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () =>
    {
        setLoading(true);
        const values = form.getFieldsValue();
        try
        {
            const request : AccountCreateDto = {
                phoneNumber: values.phoneNumber,
                passWord: values.passWord
            };
            const response = await authApi.register(request);
            navigate("/");
            
        }
        catch(error)
        {
            handleApiError(error,notificationApi);
        }
        finally
        {
            setLoading(false);
        }
    }
    
    
    return (
        <div style={{ height:"100vh" }}>
            {notificationContextHolder}
            <Row
                justify={'center'}
                align={'middle'}
                style={{ height: "100%" }}
            >
                <Col xs={20} sm={20} md={6} lg={6} xl={6} xxl={6} >
                    <p>Register now</p>
                    <Form
                        size="large"
                        layout="vertical"
                        form={form}
                        name="login"
                        initialValues={{ remember: true }}
                        style={{ maxWidth: 360 }}
                        onFinish={handleRegister}
                    >
                        <Form.Item
                            name="phoneNumber"
                            label="Enter your phone number"
                            rules={[
                                        {
                                          required: true,
                                          message: "Please enter the tenant's phone number",
                                        },
                                        {
                                          pattern: /^[0]\d{9}$/,
                                          message: "Invalid Phone Number",
                                        },
                                    ]}
                        >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    placeholder="0712345678"
                                    size="large"
                                    maxLength={10}
                                />

                        </Form.Item>

                        <Form.Item
                            name="passWord"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button block type="primary" htmlType="submit" disabled={loading}>
                                {
                                    loading ? (
                                        <Spin />
                                    ) :
                                    (
                                        "Register"
                                    )
                                }
                                
                            </Button>
                        </Form.Item>
                        
                        <Divider />

                        <Form.Item>
                            Already have account ? <a href="/">Get in!</a>
                        </Form.Item>

                    </Form>
                </Col>
            </Row>
            
         </div>
    );
    
}