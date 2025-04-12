import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const MessagePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: '70%',
  marginBottom: theme.spacing(2),
}));

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <MessagePaper
        elevation={3}
        sx={{
          backgroundColor: isUser ? '#1976d2' : '#f5f5f5',
          color: isUser ? 'white' : 'black',
        }}
      >
        <Typography variant="body1">{message}</Typography>
      </MessagePaper>
    </Box>
  );
};

export default ChatMessage; 
