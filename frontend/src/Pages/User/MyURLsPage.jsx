import  { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Container, Title, Text, Table, Button, Group, Loader, Alert, Center, Pagination, Anchor, ActionIcon, Tooltip, Modal, TextInput, Flex, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useSelector, useDispatch } from 'react-redux';
import { getIsLoggedIn, removeUser } from '../../redux/slices/User';
import { IconAlertCircle, IconEdit, IconTrash } from '@tabler/icons-react';
import Service from '../../utils/http'; // Make sure this path is correct for your Service class
// Initialize the service instance outside the component to avoid re-creation on re-renders
const service = new Service();

function MyURLsPage() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [activePage, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  // Get the login status from Redux. This is crucial for controlling the query.
  const isLoggedIn = useSelector(getIsLoggedIn);


  // React Query Hook to fetch user's short URLs
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['userShortURLs', activePage, itemsPerPage],
    queryFn: async () => { 
      const response = await service.get(`user/my/urls?page=${activePage}&limit=${itemsPerPage}`);
      return response;
    },
    // Only enable this query if the user is considered logged in by Redux.
    enabled: isLoggedIn,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    refetchOnWindowFocus: true, // Re-fetch when window regains focus
    onError: (err) => {
      if (err.response && err.response.status === 401) {
        showNotification({ title: 'Authentication Required', message: 'Your session has expired or you are not logged in. Please log in again.', color: 'red' });
        // If the session has expired, log out the user from Redux state
        dispatch(removeUser());
      } else {
        showNotification({ title: 'Error', message: err.message || 'Failed to load URLs.', color: 'red' });
      }
    },
  });

  // React Query Mutation for updating a short URL
  const updateUrlMutation = useMutation({
    mutationFn: async ({ shortCode, urlData }) => {
      const response = await service.patch(`short-url/${shortCode}`, urlData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userShortURLs']); // Invalidate cache to refetch updated data
      showNotification({
        title: 'Success',
        message: 'URL updated successfully!',
        color: 'green',
      });
      close(); // Close the modal
      setSelectedUrl(null); // Clear selected URL
    },
    onError: (err) => {
      console.error('Error updating URL:', err);
      showNotification({
        title: 'Error updating URL',
        message: err.message || 'An unexpected error occurred.',
        color: 'red',
      });
    },
  });

  // React Query Mutation for soft deleting a short URL
  const deleteUrlMutation = useMutation({
    mutationFn: async (shortCode) => {
      const response = await service.delete(`/shorten/${shortCode}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userShortURLs']); // Invalidate cache to refetch updated data
      showNotification({
        title: 'Success',
        message: 'URL deleted successfully!',
        color: 'green',
      });
    },
    onError: (err) => {
      console.error('Error deleting URL:', err);
      showNotification({
        title: 'Error deleting URL',
        message: err.message || 'An unexpected error occurred.',
        color: 'red',
      });
    },
  });

  // Destructure data safely, providing empty array as default
  const shortURLs = data?.shortURLs || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;

  const handleEditClick = (url) => {
    setSelectedUrl(url);
    open();
  };

  const handleUpdateSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedData = {
      originalUrl: formData.get('originalUrl'),
      title: formData.get('title'),
    };

    if (selectedUrl) {
      updateUrlMutation.mutate({ shortCode: selectedUrl.shortCode, urlData: updatedData });
    }
  };

  const handleDeleteClick = async (shortCode) => {
    if (window.confirm(`Are you sure you want to delete the short URL: ${shortCode}?`)) {
      await deleteUrlMutation.mutateAsync(shortCode);
    }
  };

  // Helper function to construct the full shortened link
  const getShortenedLink = (shortCode) => `${service.getBaseURL()}/api/short-url/${shortCode}`;
  // Ensure this matches your redirection logic

  // Conditional rendering based on login status
  if (!isLoggedIn) {
    return (
      <Container size="lg" mt="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Authentication Required" color="red">
          Please log in to view your short URLs.
        </Alert>
      </Container>
    );
  }

  // Loading state for initial data fetch
  if (isLoading && !data) {
    return (
      <Container size="lg" mt="xl">
        <Center mih={300}>
          <Loader size="xl" />
          <Text ml="md">Loading your short URLs...</Text>
        </Center>
      </Container>
    );
  }

  // Error state for data fetch
  if (isError) {
    return (
      <Container size="lg" mt="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          Failed to load URLs: {error?.message || 'Unknown error'}
          <Button onClick={() => refetch()} ml="md" variant="light">
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  const rows = shortURLs.map((url) => (
    <Table.Tr key={url._id}>
      <Table.Td style={{ textAlign: "center" }}><Center>
        <Anchor href={url.originalUrl} target="_blank" rel="noopener noreferrer" lineClamp={1}>
          <Tooltip label={url.originalUrl} position="bottom" withArrow>
            <span>{url.originalUrl.length > 25 ? `${url.originalUrl.slice(0, 25)}...` : url.originalUrl}</span>
          </Tooltip>
        </Anchor>
        </Center>
      </Table.Td>
      <Table.Td style={{ textAlign: "center" }}><Center>
        <Group spacing="xs" wrap="nowrap">
          <Anchor href={getShortenedLink(url.shortCode)} target="_blank" rel="noopener noreferrer" lineClamp={1}>
            {url.shortCode}
          </Anchor>
        </Group>
        </Center>
      </Table.Td>
      <Table.Td style={{ textAlign: "center" }}> <Center>{url.clickCount} </Center></Table.Td>
      <Table.Td  > <Center>{new Date(url.createdAt).toLocaleDateString()} </Center> </Table.Td>
      <Table.Td  >
        <Center>
        {url.expiresAt
          ? new Date(url.expiresAt).toLocaleDateString()
          : <Text c="dimmed" fs="italic">Never</Text>}
                  </Center>

      </Table.Td>
      <Table.Td  >
        <Center>
        <Group spacing="xs" wrap="nowrap">
          <Tooltip label="Edit URL" withArrow>
            <ActionIcon color="blue" variant="light" onClick={() => handleEditClick(url)}>
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete URL" withArrow>
            <ActionIcon
              color="red"
              variant="light"
              onClick={() => handleDeleteClick(url.shortCode)}
              loading={deleteUrlMutation.isLoading && deleteUrlMutation.variables === url.shortCode}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
        </Center>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl" my="md">
      <Group justify="space-between" align="center" mb="md">
        <Title order={3}>Link Management</Title>
        {isFetching && ( // Show loader when refetching in background
          <Loader size="sm" />
        )}
      </Group>

      {/* Conditional rendering for no URLs found */}
      {shortURLs.length === 0 && !isLoading && !isError ? (
        <Alert icon={<IconAlertCircle size={16} />} title="No URLs Found" color="blue" variant="light">
          <Text size="lg" color="dimmed">
            You haven't created any short URLs yet. Why not create one now?
          </Text>
        </Alert>
      ) : (
        <Stack>
          <Table striped highlightOnHover withTableBorder withColumnBorders style={{tableLayout: 'fixed'}}>
            <Table.Thead>
              <Table.Tr  >
                <Table.Th  > <Center>Original URL</Center> </Table.Th>
                <Table.Th  ><Center>Short Link </Center></Table.Th>
                <Table.Th  ><Center>Clicks</Center></Table.Th>
                <Table.Th  ><Center>Created On</Center></Table.Th>
                <Table.Th  ><Center>Expires On</Center></Table.Th>
                <Table.Th  ><Center>Actions</Center></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>

          {/* Pagination and Items Per Page controls */}
          <Group justify="space-between" mt="lg">
            <Text size="sm">
              Showing {Math.min(totalItems, (activePage - 1) * itemsPerPage + 1)} - {Math.min(totalItems, activePage * itemsPerPage)} of {totalItems} URLs
            </Text>
            <Flex gap="md" align="center">
              <Pagination
                total={totalPages}
                value={activePage}
                onChange={setPage}
                siblings={1}
                boundaries={1}
                color="blue"
                size="md"
                withEdges
              />
            </Flex>
          </Group>
        </Stack>
      )}

      {/* Modal for editing URLs */}
      <Modal opened={opened} onClose={close} title={`Edit URL: ${selectedUrl?.shortCode}`} centered>
        {selectedUrl && (
          <form onSubmit={handleUpdateSubmit}>
            <TextInput
              label="Original URL"
              placeholder="Enter original URL"
              name="originalUrl"
              defaultValue={selectedUrl.originalUrl}
              required
              mb="md"
            />
            <TextInput
              label="Title (Optional)"
              placeholder="A descriptive title"
              name="title"
              defaultValue={selectedUrl.title || ''}
              mb="md"
            />
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={close}>Cancel</Button>
              <Button type="submit" loading={updateUrlMutation.isLoading}>Save Changes</Button>
            </Group>
          </form>
        )}
      </Modal>
    </Container>
  );
}

export default MyURLsPage;