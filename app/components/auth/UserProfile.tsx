import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../../store/account/AccountContext";
import { useEffect, useRef } from "react";
import { UserCreateRequestDto, UserDetailsDTO } from "../../types/types";
import { handleApiError } from "../../utilities/error-handler";
import { usersApi } from "../../api/api";
import { ArrowLeftOutlined, LockOutlined, PhoneOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';


export default function UserProfile()
{
    const [notificationApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { state, dispatch } = useAccount();
    const hasNavigated = useRef(false);

    useEffect(() => {
        if (state?.accountDetails?.phoneNumber) 
        {
            const phoneNumber = state?.accountDetails?.phoneNumber;
            getUserDetails(phoneNumber);
        }
    }, []);

    // Auto-navigate when userDetails is populated (only once)
    useEffect(() => {
        if (!hasNavigated.current && state?.accountDetails?.userDetails?.firstName && state?.accountDetails?.userDetails?.lastName) 
        {
            hasNavigated.current = true;
            navigateToDestination();
        }
    }, [state?.accountDetails?.userDetails]);

    const getUserDetails = async(phoneNumber:string) => 
    {
        try
        {
            const response = await usersApi.getByPhoneNumber(phoneNumber);
            console.log("User Details:", response);
            dispatch({type: "APPEND_USER",payload: response});
        }
        catch(error:any)
        {
            handleApiError(error,notificationApi);
        }
    }

    const navigateToDestination = () =>{

        console.info("Navigating to destination with state:", state);
        const url = state.outGoingUrl?.trim();

        if (!url) {
            notificationApi.warning({
                message: "No destination URL provided.",
                description: "Please provide a valid destination URL to navigate to.",
            });
            return;
        }

        if (url.startsWith("/")) {
            navigate(url);
            return;
        }

        const detail = encodeURIComponent(JSON.stringify(state));
        const externalUrl = url.startsWith("http") ? `${url}?state=${detail}`: `https://${url}?state=${detail}`;
        window.open(externalUrl, '_blank');
    }

    const handleCreateUser = async () =>
    {
        try
        {
            const values = form.getFieldsValue();
            const userCreateDTO :UserCreateRequestDto = {
                firstName : values.firstName,
                lastName : values.lastName,
                phoneNumber: state?.accountDetails?.phoneNumber ?? ""
            };

            const response = await usersApi.registerUser(userCreateDTO);
            dispatch({type: "APPEND_USER",payload: response});
        }
        catch(error:any)
        {
            handleApiError(error,notificationApi);
        }
    }

    
    return (
        <>
            {contextHolder}
            {
                (state?.accountDetails?.userDetails == undefined ) || (state?.accountDetails?.userDetails == null ) ||
                (state?.accountDetails?.userDetails?.firstName == "" ) || (state?.accountDetails?.userDetails?.lastName == "" ) ||
                (state?.accountDetails?.userDetails?.firstName == undefined ) || (state?.accountDetails?.userDetails?.lastName == undefined )
                ? (
                    <div style={{ height:"100vh" }}>
                        
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
                                    onFinish={handleCreateUser}
                                >
                                    <Form.Item
                                    >
                                        <h1>How can we address you</h1>
                                    </Form.Item>
                                    <Form.Item
                                        name="firstName"
                                        label="First Name"
                                        rules={[{ required: true, message: 'Please input your First Name!' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="lastName"
                                        label="Last Name"
                                        rules={[{ required: true, message: 'Please input your last name!' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button block type="primary" htmlType="submit">
                                            Submit
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
                ) : (
                    <div style={{ height:"100vh" }}>
                        <Row
                            justify={'center'}
                            align={'middle'}
                            style={{ height: "100%" }}
                        >
                            <Col xs={20} sm={20} md={6} lg={6} xl={6} xxl={6} >
                                <div style={{ textAlign: 'center' }}>
                                    <h1>Profile Confirmed</h1>
                                    <p><strong>Name:</strong> {state?.accountDetails?.userDetails?.firstName} {state?.accountDetails?.userDetails?.lastName}</p>
                                    <p><strong>Phone:</strong> {state?.accountDetails?.phoneNumber}</p>
                                    <p style={{ marginTop: '24px', color: '#666' }}>Redirected you to your destination</p>
                                </div>
                            </Col>
                        </Row>     
                    </div>
                )
            }
        </>
        
    );
}