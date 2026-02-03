import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  IconButton,
  Divider,
  Paper,
  Stack,
  Chip,
  Button,
  Menu,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  EmojiEmotions as EmojiIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  Check as CheckIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);

// Mock data for conversations
const mockConversations = [
  {
    id: 1,
    name: 'John Doe',
    phone: '+1 234 567 8901',
    avatar: null,
    lastMessage: 'Hey, how are you doing?',
    timestamp: '2 min ago',
    unreadCount: 2,
    isOnline: true,
    messages: [
      { id: 1, text: 'Hi there!', sent: false, timestamp: '10:00 AM', status: 'read' },
      { id: 2, text: 'Hello! How can I help you?', sent: true, timestamp: '10:01 AM', status: 'read' },
      { id: 3, text: 'I need some information about the project', sent: false, timestamp: '10:02 AM', status: 'read' },
      { id: 4, text: 'Sure, what would you like to know?', sent: true, timestamp: '10:03 AM', status: 'delivered' },
      { id: 5, text: 'Hey, how are you doing?', sent: false, timestamp: '10:30 AM', status: 'delivered' },
    ],
  },
  {
    id: 2,
    name: 'Sarah Smith',
    phone: '+1 234 567 8902',
    avatar: null,
    lastMessage: 'Thanks for the update!',
    timestamp: '15 min ago',
    unreadCount: 0,
    isOnline: true,
    messages: [
      { id: 1, text: 'Good morning!', sent: false, timestamp: '9:00 AM', status: 'read' },
      { id: 2, text: 'Good morning! How are you?', sent: true, timestamp: '9:05 AM', status: 'read' },
      { id: 3, text: 'I wanted to update you on the progress', sent: true, timestamp: '9:10 AM', status: 'read' },
      { id: 4, text: 'Thanks for the update!', sent: false, timestamp: '9:15 AM', status: 'read' },
    ],
  },
  {
    id: 3,
    name: 'Mike Johnson',
    phone: '+1 234 567 8903',
    avatar: null,
    lastMessage: 'See you tomorrow!',
    timestamp: '1 hour ago',
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: 1, text: 'Are we meeting tomorrow?', sent: false, timestamp: '8:00 AM', status: 'read' },
      { id: 2, text: 'Yes, at 10 AM in the conference room', sent: true, timestamp: '8:05 AM', status: 'read' },
      { id: 3, text: 'Perfect! See you tomorrow!', sent: false, timestamp: '8:10 AM', status: 'read' },
    ],
  },
  {
    id: 4,
    name: 'Emma Wilson',
    phone: '+1 234 567 8904',
    avatar: null,
    lastMessage: 'Can you send me the files?',
    timestamp: '2 hours ago',
    unreadCount: 1,
    isOnline: false,
    messages: [
      { id: 1, text: 'Hi! I need the project files', sent: false, timestamp: 'Yesterday', status: 'read' },
      { id: 2, text: 'Sure, I will send them shortly', sent: true, timestamp: 'Yesterday', status: 'read' },
      { id: 3, text: 'Can you send me the files?', sent: false, timestamp: '2 hours ago', status: 'delivered' },
    ],
  },
  {
    id: 5,
    name: 'David Brown',
    phone: '+1 234 567 8905',
    avatar: null,
    lastMessage: 'Great work on the presentation!',
    timestamp: '3 hours ago',
    unreadCount: 0,
    isOnline: true,
    messages: [
      { id: 1, text: 'How did the presentation go?', sent: false, timestamp: '3 hours ago', status: 'read' },
      { id: 2, text: 'It went really well! Thanks for asking', sent: true, timestamp: '3 hours ago', status: 'read' },
      { id: 3, text: 'Great work on the presentation!', sent: false, timestamp: '3 hours ago', status: 'read' },
    ],
  },
  {
    id: 6,
    name: 'Lisa Anderson',
    phone: '+1 234 567 8906',
    avatar: null,
    lastMessage: 'I will call you later',
    timestamp: '5 hours ago',
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: 1, text: 'Are you available for a quick call?', sent: false, timestamp: '5 hours ago', status: 'read' },
      { id: 2, text: 'Sorry, I am in a meeting right now', sent: true, timestamp: '5 hours ago', status: 'read' },
      { id: 3, text: 'I will call you later', sent: false, timestamp: '5 hours ago', status: 'read' },
    ],
  },
];

const MessagesPage = () => {
  const theme = useTheme();
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  // Simulated API call - will be replaced with real API
  const fetchConversations = useCallback(async () => {
    // TODO: Replace with actual API call
    // const response = await axios.post(`${config.api.services}messages/list`, {
    //   search: searchTerm,
    // });
    // setConversations(response.data);
    setConversations(mockConversations);
  }, [searchTerm]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Filter conversations based on search
  const filteredConversations = useMemo(() => {
    if (!searchTerm) return conversations;
    return conversations.filter(
      (conv) =>
        conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.phone.includes(searchTerm)
    );
  }, [conversations, searchTerm]);

  // Get initials for avatar
  const getInitials = useCallback((name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  // Get avatar color based on name
  const getAvatarColor = useCallback((name) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }, [theme]);

  // Handle conversation selection
  const handleConversationClick = useCallback((conversation) => {
    setSelectedConversation(conversation);
    // Mark messages as read
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  }, []);

  // Handle send message
  const handleSendMessage = useCallback(() => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      text: messageText,
      sent: true,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      status: 'sent',
    };

    // Update selected conversation with new message
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
      lastMessage: messageText,
      timestamp: 'Just now',
    };

    setSelectedConversation(updatedConversation);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === updatedConversation.id ? updatedConversation : conv
      )
    );
    setMessageText('');

    // TODO: Send message via API
    // await axios.post(`${config.api.services}messages/send`, {
    //   conversationId: selectedConversation.id,
    //   message: messageText,
    // });
  }, [messageText, selectedConversation]);

  // Handle file attachment
  const handleFileAttach = useCallback(() => {
    // TODO: Implement file upload
    console.log('File attach clicked');
  }, []);

  // Handle emoji
  const handleEmojiClick = useCallback(() => {
    // TODO: Implement emoji picker
    console.log('Emoji clicked');
  }, []);

  // Handle menu
  const handleMenuClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Message status icon
  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'sent':
        return <CheckIcon sx={{ fontSize: 14, color: 'text.secondary' }} />;
      case 'delivered':
        return <DoneAllIcon sx={{ fontSize: 14, color: 'text.secondary' }} />;
      case 'read':
        return <DoneAllIcon sx={{ fontSize: 14, color: 'primary.main' }} />;
      default:
        return null;
    }
  }, []);

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', width: '100%', display: 'flex', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* Left Side - Conversations List */}
        <Box sx={{ width: { xs: '100%', md: '35%', lg: '30%', xl: '28%' }, height: '100%', borderRight: `1px solid ${theme.palette.divider}` }}>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            elevation={0}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 0,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
              {/* Header */}
              <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Messages
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>

              {/* Conversations List */}
              <List sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
                <AnimatePresence>
                  {filteredConversations.map((conversation, index) => (
                    <MotionListItem
                      key={conversation.id}
                      disablePadding
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ListItemButton
                        onClick={() => handleConversationClick(conversation)}
                        selected={selectedConversation?.id === conversation.id}
                        sx={{
                          py: 2,
                          px: 2,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          '&.Mui-selected': {
                            background: alpha(theme.palette.primary.main, 0.1),
                            borderLeft: `4px solid ${theme.palette.primary.main}`,
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            sx={{
                              '& .MuiBadge-badge': {
                                backgroundColor: conversation.isOnline ? '#44b700' : '#9e9e9e',
                                color: conversation.isOnline ? '#44b700' : '#9e9e9e',
                                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                                '&::after': conversation.isOnline ? {
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: '50%',
                                  animation: 'ripple 1.2s infinite ease-in-out',
                                  border: '1px solid currentColor',
                                  content: '""',
                                } : {},
                              },
                              '@keyframes ripple': {
                                '0%': {
                                  transform: 'scale(.8)',
                                  opacity: 1,
                                },
                                '100%': {
                                  transform: 'scale(2.4)',
                                  opacity: 0,
                                },
                              },
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                background: getAvatarColor(conversation.name),
                              }}
                            >
                              {getInitials(conversation.name)}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {conversation.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {conversation.timestamp}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '180px',
                                }}
                              >
                                {conversation.lastMessage}
                              </Typography>
                              {conversation.unreadCount > 0 && (
                                <Chip
                                  label={conversation.unreadCount}
                                  size="small"
                                  color="primary"
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </MotionListItem>
                  ))}
                </AnimatePresence>
              </List>
            </CardContent>
          </MotionCard>
        </Box>

        {/* Right Side - Chat Area */}
        <Box sx={{ flex: 1, height: '100%' }}>
          {selectedConversation ? (
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              }}
            >
              {/* Chat Header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: selectedConversation.isOnline ? '#44b700' : '#9e9e9e',
                        color: selectedConversation.isOnline ? '#44b700' : '#9e9e9e',
                        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        background: getAvatarColor(selectedConversation.name),
                      }}
                    >
                      {getInitials(selectedConversation.name)}
                    </Avatar>
                  </Badge>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedConversation.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedConversation.isOnline ? 'Online' : 'Offline'} • {selectedConversation.phone}
                    </Typography>
                  </Box>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton color="primary">
                    <PhoneIcon />
                  </IconButton>
                  <IconButton color="primary">
                    <VideoCallIcon />
                  </IconButton>
                  <IconButton onClick={handleMenuClick}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Mute Notifications</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Clear Chat</MenuItem>
                    <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                      Block Contact
                    </MenuItem>
                  </Menu>
                </Stack>
              </Box>

              {/* Messages Area */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <AnimatePresence>
                  {selectedConversation.messages.map((message, index) => (
                    <MotionBox
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sent ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          maxWidth: '85%',
                          minWidth: '200px',
                          borderRadius: 2,
                          background: message.sent
                            ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                            : theme.palette.mode === 'dark'
                            ? '#2d2d2d'
                            : '#f5f5f5',
                          color: message.sent ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography variant="body1">{message.text}</Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              opacity: 0.8,
                              fontSize: '0.7rem',
                            }}
                          >
                            {message.timestamp}
                          </Typography>
                          {message.sent && getStatusIcon(message.status)}
                        </Box>
                      </Paper>
                    </MotionBox>
                  ))}
                </AnimatePresence>
              </Box>

              {/* Message Input */}
              <Box
                sx={{
                  p: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  background: theme.palette.background.paper,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton onClick={handleEmojiClick} color="primary">
                    <EmojiIcon />
                  </IconButton>
                  <IconButton onClick={handleFileAttach} color="primary">
                    <AttachFileIcon />
                  </IconButton>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    multiline
                    maxRows={4}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleSendMessage}
                    color="primary"
                    disabled={!messageText.trim()}
                    sx={{
                      background: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        background: theme.palette.primary.dark,
                      },
                      '&:disabled': {
                        background: theme.palette.action.disabledBackground,
                      },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Stack>
              </Box>
            </MotionCard>
          ) : (
            <MotionCard
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 0,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    margin: '0 auto',
                    mb: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  <SearchIcon sx={{ fontSize: 50 }} />
                </Avatar>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Select a conversation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose a conversation from the list to start messaging
                </Typography>
              </Box>
            </MotionCard>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MessagesPage;
