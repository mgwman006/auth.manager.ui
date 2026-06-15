import { Button, Checkbox, Col, Flex, Form, Input, notification, Row, Space } from "antd";
import { ArrowLeftOutlined, LockOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { useAccount } from "../../store/account/AccountContext";
import { useEffect } from "react";
import { AccountAuthRequestDTO, AccountAuthResponseDTO } from "../../types/types";
import { handleApiError } from "../../utilities/error-handler";
import { authApi } from "../../api/api";
import { useNavigate } from "react-router";


export default function LogIn()
{
    const [form] = Form.useForm();
    const { state, dispatch } = useAccount();
    const [notificationApi, notificationContextHolder] = notification.useNotification();
    const navigate = useNavigate();


    useEffect(() => {
        if (state?.accountDetails?.phoneNumber) 
        {
            form.setFieldsValue({ phoneNumber: state?.accountDetails?.phoneNumber});
        }
    }, [state]);

    const handleLogIn = async () =>
    {
        const values = form.getFieldsValue();
        try
        {
            const request : AccountAuthRequestDTO = {
                phoneNumber: state.accountDetails?.phoneNumber??"",
                passWord: values.passWord
            };

            const response: AccountAuthResponseDTO = await authApi.logIn(request);

            dispatch(
            {
                type: "APPEND_JWT",
                payload: response.jwtToken
            });
           

            const url = state.outGoingUrl?.trim();

            if (!url) {
                navigate("/user");
                return;
            }

            if (url.startsWith("/")) {
                navigate(url);
                return;
            }

            const updatedState = {
                ...state,
                accountDetails: {
                    ...state.accountDetails,
                    token: response.jwtToken
                }
            };

            const detail = encodeURIComponent(
                JSON.stringify(updatedState)
            );

            

            const externalUrl = url.startsWith("http")
                ? `${url}?state=${detail}`
                : `https://${url}?state=${detail}`;

            window.location.assign(externalUrl);
            
        }
        catch(error)
        {
            handleApiError(error,notificationApi);
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
                    <Form
                        size="large"
                        layout="vertical"
                        form={form}
                        name="login"
                        initialValues={{ remember: true }}
                        style={{ maxWidth: 360 }}
                        onFinish={handleLogIn}
                    >
                        <Form.Item
                        >
                            <h1>Enter a password for {state.accountDetails?.phoneNumber}, to log in</h1>
                        </Form.Item>

                        <Form.Item
                            name="passWord"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                        </Form.Item>

                        {/* <Form.Item>
                            <Flex justify="space-between" align="center">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <a href="">Forgot password</a>
                            </Flex>
                        </Form.Item> */}

                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                            Log in
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button type="default" onClick={()=> navigate(-1)}>
                            <ArrowLeftOutlined />
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
              
        </div>
    );
}