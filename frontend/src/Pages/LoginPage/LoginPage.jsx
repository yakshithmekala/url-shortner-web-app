import { Button, Card, Center, Stack } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import LoginBackground from '../../assets/LoginBackground.png';

import '@mantine/core/styles.css';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    console.log('Login with Google');
  };

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
      <Center style={{ height: '100%' }}>
        <Card
          shadow="lg"
          padding="xl"
          radius="md"
          style={{
            backgroundColor: 'rgba(3, 81, 123, 0.5)',
            backdropFilter: 'blur(8px)',
            height: '80%',
            width: '80%'
          }}
        >
          <Stack align="center" spacing="lg">
            <Button
              leftSection={<IconBrandGoogle size={20} />}
              color="green"
              variant="filled"
              onClick={handleGoogleLogin}
            >
              Login with Google
            </Button>
          </Stack>
        </Card>
      </Center>
    </div>
  );
}
