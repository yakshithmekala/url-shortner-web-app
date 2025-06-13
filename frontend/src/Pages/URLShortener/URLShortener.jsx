import { ActionIcon, Button, Center, Text, TextInput, Tooltip } from '@mantine/core'
import LinkBackground from '../../assets/LinksBackground.png';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Service from '../../utils/http';
import { SHORTEN_URL } from '../../utils/urls';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useClipboard } from '@mantine/hooks';

const URLShortener = () => {

  const service = new Service();

  const [title, setTitle] = useState('')
  const [originalURL, setOriginalURL] = useState('')
  const [expiryDate, setExpiryDate] = useState('');
  const [shortCode, setShortCode] = useState('skdjf')
  const [copied, setCopied] = useState(false);

  const clipboard = useClipboard({ timeout: 1000 })

  const getData = async () => {
    const response = await service.post(SHORTEN_URL, { originalUrl: originalURL, expiresAt: expiryDate, title });
    return response;
  }
  const { mutate, data } = useMutation({ mutationFn: getData, onSuccess: (data) => {
    setTitle('');
    setOriginalURL('')
    setExpiryDate('')
    showNotification({
      title: "Success",
      message: "Short URL Generated",
      color: 'green'
    })
    console.log(data)
    setShortCode(data.shortCode)
  }, onError: (error) => {
    console.error(error);
    showNotification({
      title: "Error",
      message: error.message ?? "Some Error Occurred",
      color: 'red'
    })
  }});

  const validateAndGenerateURL = () => {
    if(!originalURL || originalURL.length === 0 || originalURL === '') {
      showNotification({
        title: "Info",
        message: "Original URL is Mandatory to generate Short URL!",
        color: 'blue'
      })
    }
    mutate()
  }

  return (
    <Center h={'90vh'} style={{ background: `url(${LinkBackground})`, backgroundPosition: 'center', backgroundSize: 'cover'}}>
        <Center style={{ height: '95%', width: '95%', backgroundColor: 'rgba(3, 125, 191, 0.61)', backdropFilter: 'blur(10px)', borderRadius: '10px', flexDirection: 'column'}}>
            {shortCode && shortCode.length > 0 ?
              <> 
                <Text fw={'bolder'} size='xl' c={'white'} my={'lg'}>Generated Code </Text>
                <div style={{ display: 'flex', alignItems: 'center'}}>
                  <TextInput
                    value={shortCode}
                    w={400}
                    mx="sm"
                    readOnly
                    styles={{
                      input: {
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: 'lightblue'
                      },
                    }}
                    rightSection={
                      <Tooltip label={clipboard.copied ? "Copied!" : "Copy"} position="left" withArrow>
                        <ActionIcon
                          variant="light"
                          onClick={() => {
                            clipboard.copy(shortCode);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1000);
                          }}
                        >
                          {clipboard.copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        </ActionIcon>
                      </Tooltip>
                    }
                  />
                </div>
              </>
              :
            <>
              `  <TextInput 
                  placeholder='Title of URL' 
                  w={400} 
                  radius={'md'} 
                  my={'lg'} 
                  label="Title"
                  labelProps={{ style: { color: 'white', fontWeight: 'bold' } }}
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
                <TextInput 
                    placeholder='Paste Original URL' 
                    w={400} 
                    radius={'md'} 
                    mb={'lg'}
                    label="Original URL"
                    labelProps={{ style: { color: 'white', fontWeight: 'bold' } }}
                    onChange={(e) => setOriginalURL(e.target.value)}
                    aria-valuemax={originalURL}
                />
                <TextInput 
                    type='date' 
                    w={400} 
                    mb={'lg'}
                    label="Date of Expiry"
                    labelProps={{ style: { color: 'white', fontWeight: 'bold' } }}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    value={expiryDate}
                />
                <Button 
                  color='white' 
                  variant='outline' 
                  w={400}
                  onClick={validateAndGenerateURL}
                >
                  Generate And Shorten URL
                </Button>`
            </>}
        </Center>
    </Center>
  )
}

export default URLShortener