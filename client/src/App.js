
import { Box, Button, Text } from "@chakra-ui/react";
import React, {useState} from 'react';
import axios from 'axios';

function App() {
  const[message, setMessage]= useState('');
  const[remaining, setRemaining]= useState(null);

  const handleRequest = async() =>{
    
    try{
      const res= await axios.get('http://localhost:3000');
      console.log("Headers recieved:", res.headers);
      setMessage(res.data.message);
      setRemaining(parseInt(res.headers['x-ratelimit-remaining'],10));
    }catch(err){
      console.error(err);
      setMessage('Rate limit exceeded');
      setRemaining(0);
    }
  }

  return (
    
      <Box minH="100vh" bg="yellow.200" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={4} >
        <Button colorScheme="blue" size="lg" onClick={handleRequest}>
          Send request
        </Button>
        <Text fontSize="xl" >
          {message}
        </Text>
        {remaining!== null && (
          <Text color="gray.600">
          Remaining requests:{remaining}
        </Text>
        )}
        
      </Box>
    
  );
}

export default App;
