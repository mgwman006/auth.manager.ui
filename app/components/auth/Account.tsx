import { Button, Checkbox, Col, Divider, Flex, Form, Input, notification, Row } from "antd";
import { LockOutlined, PhoneFilled, PhoneOutlined, RightOutlined, SmileOutlined, UserOutlined}from "@ant-design/icons";
import { authApi } from "../../api/api";
import { ApiError } from "../../types/types";
import { handleApiError } from "../../utilities/error-handler";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "../../store/account/AccountContext";
import { useEffect } from "react";

export default function Account()
{

    const [notificationApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { state, dispatch } = useAccount();
    const [searchParams] = useSearchParams();

    const outGoingUrl = searchParams.get("outGoingUrl");
    const phoneNumber = searchParams.get("phoneNumber");
    form.setFieldsValue({ phoneNumber: phoneNumber || "" });


    useEffect(() => {
        console.info("outGoingUrl from query params:", outGoingUrl);
        if (outGoingUrl) { 
            dispatch({type: "ADD_OUTGOING_URL", outGoingUrl: outGoingUrl});
            console.info("Dispatched outGoingUrl to state:", outGoingUrl);
        }
    }, [outGoingUrl, dispatch]);

    const onFinish = async () => {

        dispatch({ type: "FETCH_START" });
        try 
        {
            const values = form.getFieldsValue();
            const response = await authApi.getAccount(values.phoneNumber);
            dispatch({type: "FETCH_SUCCESS",payload: response});
            navigate('login');
        } 
        catch (error:any) 
        {
            handleApiError(error,notificationApi)
        }
    };

    return (
        <div
            style={{
                height:"100vh"
            }}
        >
            {contextHolder}

            <Row
                justify={'center'}
                align={'middle'}
                style={{ height: "100%" }}
            >
                <Col xs={20} sm={20} md={6} lg={6} xl={6} xxl={6} >
                    <Form
                        form={form}
                        size="large"
                        layout="vertical"
                        name="login"
                        initialValues={{ remember: true }}
                        style={{ maxWidth: 360 }}
                        onFinish={onFinish}
                    >
                        <Form.Item>
                            <h1 style={{textAlign:"center"}}>Welcome To Tante</h1>
                        </Form.Item>
                        <Form.Item
                            name="phoneNumber"
                            label="Enter your phone number"
                            rules={[{ required: true, message: 'Please input your phoneNumber!' }]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                        </Form.Item>
                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                                Next <RightOutlined/>
                            </Button>
                        </Form.Item>

                        <Divider />

                        <Form.Item>
                            <a href="/register">Register now!</a>
                        </Form.Item>

                    </Form>
                </Col>
            </Row>
        </div>
    );
}