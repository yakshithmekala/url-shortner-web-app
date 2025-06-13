import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Text, Title, Loader, Center, Container, Stack } from '@mantine/core'; // Import Stack
import Service from '../../utils/http';

const service = new Service();

const fetchUser = async () => {
  const res = await service.get('user/me');
  return res;
};

const ProfilePage = () => {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUser,
  });

  const avatarSource = typeof user?.avatar === 'string' && user?.avatar?.trim() !== ''
  ? user.avatar
  : undefined;

  if (isLoading) {
    return (
      <Center mt="xl">
        <Loader size="xl" />
        <Text ml="md">Loading profile...</Text>
      </Center>
    );
  }

  if (isError || !user) {
    return (
      <Center mt="xl">
        <Text color="red" size="lg">Failed to load user profile. Please try again later.</Text>
      </Center>
    );
  }

  return (
    <Container size="sm" mt="xl">
      <Stack align="center" spacing="lg"> {/* Use Stack for vertical alignment and spacing */}
<Avatar src={avatarSource} alt={user.name || "User Avatar"} size={120} radius="100%">
  {!avatarSource && avatarFallback}
</Avatar>        <Title order={1} align="center" mt="md">{user.name}</Title> {/* Larger title */}
        <Text align="center" color="dimmed" size="lg">{user.email}</Text> {/* Larger email text */}
        {/* User details */}
        <Text size="md">
          <strong>User ID:</strong> {user._id}
        </Text>
        <Text size="md">
          <strong>Account Created:</strong> {new Date(user.createdAt).toLocaleString()}
        </Text>
      </Stack>
    </Container>
  );
};

export default ProfilePage;