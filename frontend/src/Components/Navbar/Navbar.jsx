import { ActionIcon, Avatar, Button, Menu, Text } from '@mantine/core'
import React from 'react'
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
  IconLogin,
} from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { getIsLoggedIn, getUserAvatar, removeUser } from '../../redux/slices/User';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const userAvatar = useSelector(getUserAvatar);
    const isLoggedIn = useSelector(getIsLoggedIn);
    const dispatch = useDispatch();

  return (
    <nav className='navbar' style={{ height: 60, width: '100%', background: 'linear-gradient(45deg, rgba(0, 160, 206, 0.8), rgba(220, 82, 241, 0.5))'}}>
        <div className='logo' style={{ display: 'flex', alignItems: 'center', height: '100%'}}>
            <Text mx={30} c='white' style={{ fontWeight: 'bolder'}}>URL <Text component='span'>Shortener</Text></Text>
        </div>
        <div style={{ width: '80%', display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
            {isLoggedIn ? <Menu shadow="md" width={200}>
                <Menu.Target>
                    <Avatar mx={'lg'} src={userAvatar} alt='Profile' size={'md'} style={{ cursor: 'pointer'}}/>     
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>Actions</Menu.Label>
                    <Menu.Item>
                        Profile
                    </Menu.Item>
                    <Menu.Item onClick={() => dispatch(removeUser())}>
                        Logout
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu> : 
            <Button variant='transparent' color='black' mx={'lg'} component={Link} to={'/login'}>
                <IconLogin/>
            </Button>
            }
        </div>
    </nav>
  )
}

export default Navbar