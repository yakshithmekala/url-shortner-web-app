import { Button, Card, Center, Stack, Text } from '@mantine/core';
import LoginBackground from '../../assets/LoginBackground.png';
import '@mantine/core/styles.css';
import { GoogleLogin } from '@react-oauth/google';
import { showNotification } from '@mantine/notifications'
import Service from '../../utils/http'
import { GOOGLE_AUTH_LOGIN } from '../../utils/urls';
import { useDispatch, useSelector } from 'react-redux';
import { getIsLoggedIn, setUser } from '../../redux/slices/User';
import { Navigate, useNavigate } from 'react-router-dom';

export default function LoginPage() {

    const service = new Service();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(getIsLoggedIn)
    
    const googleResponse = async (res) => {
        try {
            const token = res.credential
            
            if (!token) {
                showNotification({
                    title: "Error",
                    message: "Invalid Response From Google",
                    color: 'red'
                })
                return
            }

            //   setIsLoading(true)
            const response = await service.post(GOOGLE_AUTH_LOGIN, { token });
            const data = response.data;
        
            dispatch(
                setUser({
                    name: data.name,
                    avatar: data.avatar,
                    token: data.token,
                    email: data.email,
                    isLoggedIn: true
                    })
                )
                showNotification({
                    title: "Success",
                    message: "Welcome! Login Successfully.",
                    color: 'green'
                })
            navigate('/')
        } catch (error) {
            showNotification({
                title: 'Error',
                message: error.response.data.message ?? "Some Error Occurred!",
                color: 'red'
            })
        console.error('Google login error:', error)
        }
    }

    if(isLoggedIn) {
        return <Navigate to={'/'} />
    }

    return (
        <div
            style={{
                backgroundImage: `url(${LoginBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                width: '100%',
            }}
        >
        <Center style={{ height: '90%' }}>
            <Card
                shadow="lg"
                padding="xl"
                radius="md"
                style={{
                    backgroundColor: 'rgba(3, 81, 123, 0.5)',
                    backdropFilter: 'blur(8px)',
                    height: '90%',
                    width: '90%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}
                >
                <Text c='white' my={'sm'}>Login To <Text style={{ fontWeight: 'bolder'}} c='white' component='span'>Being Zero URL Shortener</Text></Text>
                <Stack align="center" spacing="lg">
                    <GoogleLogin
                        width={250}
                        theme={'filled_black'}
                        useOneTap={true}
                        onSuccess={googleResponse}
                    />
                </Stack>
            </Card>
        </Center>
        </div>
    );
}
