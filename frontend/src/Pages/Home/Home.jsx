import { BackgroundImage, Button, Center, Group, Text } from "@mantine/core"
import HomeBackground from '../../assets/HomeBackground.png'
import { useSelector } from "react-redux"
import { getIsLoggedIn } from "../../redux/slices/User"
import { useNavigate } from "react-router-dom"

const Home = () => {

    const isLoggedIn = useSelector(getIsLoggedIn);
    const navigate = useNavigate();
  return (
    <div style={{ 
        display:'flex', 
        height: '92vh', 
        width: '100%', 
        backgroundImage: `url(${HomeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }}
    >
        <Group w={'50%'}>
            <Center style={{ height: '95%', width: '100%', background: 'linear-gradient(to left, rgba(248, 141, 248, 0.7), rgba(70, 166, 222, 0.5))', backdropFilter: 'blur(5px)', borderRadius: '10px', flexDirection: 'column'}}>
                <Text size={'30px'} ta={'center'} c={'white'}>
                    Welcome to <Text size="40px" c={'white'} fw={'bold'}>Being Zero URL Shortener</Text>
                </Text>
                <Button 
                    my={'lg'} 
                    variant="outline" 
                    c={'white'}
                    onClick={() => {isLoggedIn ? navigate('/urlShortener') : navigate('/login')}}
                    >
                        Get Started
                    </Button>
            </Center>
        </Group>
        <Group  w={'50%'}>
            <Center style={{ height: '95%', width: '100%', background: 'linear-gradient(to left, rgba(248, 141, 248, 0.7), rgba(70, 166, 222, 0.5))', backdropFilter: 'blur(8px)', borderRadius: '10px'}}>
                
            </Center>
        </Group>
    </div>
  )
}

export default Home 