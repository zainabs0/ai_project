import {
  useEffect,
  useRef,
  useState,
} from 'react';

import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import ChatMessage from './ChatMessage';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { text: data.choices[0].message.content, isUser: false },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, there was an error processing your message.', isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
          AI Chatbot
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            mb: 2,
            p: 2,
          }}
        >
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
          {isLoading && (
            <ChatMessage
              message="Thinking..."
              isUser={false}
            />
          )}
          <div ref={messagesEndRef} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatInterface; 
