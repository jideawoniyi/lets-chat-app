// Chat.js
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { TextField, IconButton, Box, InputAdornment, Paper, Typography, Grid, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';  
import { useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles';
import { Menu, MenuItem } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
    width: '100%',
    padding: theme.spacing(1),
    boxSizing: 'border-box',
  },
  header: {
    color: 'lightgrey',
    padding: theme.spacing(1),
  },
  messageContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    backgroundColor: '#1a1a1a',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    maxHeight: 'calc(90vh - 120px)', // Adjust as needed
  },
  messageRow: {
    position: 'relative',
    paddingTop: theme.spacing(1),
    '&:hover $timestamp': { // Add hover effect to show timestamp
      visibility: 'visible',
    },
  },  


  messageBubble: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '20px',
    padding: theme.spacing(1),
    boxShadow: '0 2px 2px rgba(0,0,0,0.2)',
    wordBreak: 'break-word', // To prevent overflow
    maxWidth: 'fit-content', // Adjust width to fit the content
  },
  sentMessage: {
    backgroundColor: '#2979FF',
    color: '#fff',
    marginLeft: 'auto',
    textAlign: 'right',
    position: 'relative', // Add relative positioning for the absolute timestamp
  },
  receivedMessage: {
    backgroundColor: '#2e2e2e',
    marginRight: 'auto',
    textAlign: 'left',
    position: 'relative', // Add relative positioning for the absolute timestamp
  },
  timestamp: {
    color: 'lightgrey',
    position: 'absolute',
    bottom: '-20px',
    right: 0,
    left: 0,
    backgroundColor: 'transparent', // No background color
    padding: 0, // Remove padding if any
    visibility: 'hidden', // Hidden by default, shown on hover
  },

  replyOrigin: {
    color: 'lightgrey',
    fontStyle: 'italic',
    fontSize: '0.8rem',
    wordWrap: 'break-word',
    maxWidth: '80%', // Limit the width
    margin: '0 auto', // Center it
    position: 'relative', // For the arrow positioning
  },
  
  iconRotated: {
    transform: 'rotate(-45deg)',
  },
  
  typingIndicator: {
    fontStyle: 'italic',
    color: '#bbb',
    padding: theme.spacing(0, 2),
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  inputField: {
    width: '100%',
  },
  sendButton: {
    color: theme.palette.primary.main,
  },

  typingPulse: {
    animation: `$pulse 1.5s infinite`,
  },
  "@keyframes pulse": {
    "0%, 100%": {
      opacity: 1,
    },
    "50%": {
      opacity: 0.5,
    },
  },
}));

const ENDPOINT = "http://localhost:4000";
const socket = socketIOClient(ENDPOINT);

const Chat = ({ username }) => {
const classes = useStyles();
const theme = useTheme();
const [message, setMessage] = useState('');
const [messages, setMessages] = useState([]);
const [typingUser, setTypingUser] = useState('');
const [downloadedImages, setDownloadedImages] = useState({});
const [contextMenu, setContextMenu] = useState(null);
const [replyMode, setReplyMode] = useState(false);
const [replyToMessage, setReplyToMessage] = useState(null);


  useEffect(() => {
    const receiveMessage = (msg) => {
      if (msg.sender !== username) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    };

    const receiveImage = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    socket.on('receiveImage', receiveImage);
    socket.on('receiveMessage', receiveMessage);
    socket.on('typing', (user) => {
      if (user !== username) {
        setTypingUser(user);
      }
    });
    
    
    socket.on('stopTyping', () => setTypingUser(''));

    return () => {
      socket.off('receiveMessage', receiveMessage);
      socket.off('receiveImage', receiveImage);
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [username]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: username,
        timestamp: new Date().toISOString(),
        replyTo: replyToMessage // Include the entire message being replied to
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit('sendMessage', newMessage);
      setMessage('');
      setReplyMode(false); // Reset reply mode
      setReplyToMessage(null); // Clear the message being replied to
    }
  };
  
  
  const handleReply = (message) => {
    setReplyToMessage(message);
    setReplyMode(true);
    handleClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
      sendMessage();
      e.preventDefault(); // Prevent the default action to avoid form submission
    }
  };
  
  
  // const exitReplyMode = () => {
  //   setReplyMode(false);
  //   setReplyToMessage(null);
  // };
  
  const ReplyView = () => (
    replyMode && replyToMessage && ( // Ensure replyToMessage is not null
      <div style={{ /* Overlay styles */ }}>
        <div style={{ backgroundColor: '#333', color: 'white', padding: theme.spacing(2), borderRadius: theme.shape.borderRadius, /* other styling */ }}>
          <Typography variant="caption" style={{ marginBottom: theme.spacing(1), color: 'lightgrey' }}>
            Replying to {replyToMessage.sender === username ? "Me" : replyToMessage.sender}: {replyToMessage.text}
          </Typography>
          <TextField
            label="Type a reply..."
            variant="outlined"
            fullWidth
            autoFocus
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            InputLabelProps={{
              style: { color: 'lightgrey' }
            }}
            InputProps={{
              style: { color: 'white' }
            }}
          />
          <div style={{ textAlign: 'right' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => { sendMessage(); setReplyMode(false); setReplyToMessage(null); }} // Send and close reply box
              style={{ marginRight: theme.spacing(1) }}
            >
              Send
            </Button>
            <Button 
              onClick={() => { setReplyMode(false); setReplyToMessage(null); }} // Close reply box without sending
            >
              Cancel
              </Button>
            </div>
          </div>
        </div>
      )
  );
  
  
  
  const handleCopy = (message) => {
    navigator.clipboard.writeText(message.text)
      .then(() => {
        // Handle successful copying here, like showing a notification
      })
      .catch(err => {
        // Handle errors here, like permission issues
        console.error('Could not copy text: ', err);
      });
    handleClose();
  };
  
  
  const handleDelete = (message) => {
    setMessages(messages => messages.filter(msg => msg !== message));
    handleClose();
  };
  
  
const handleClose = () => {
  setContextMenu(null); // Close the context menu
};

// Context Menu Component
const RenderContextMenu = () => (
  <Menu
    keepMounted
    open={contextMenu !== null}
    onClose={handleClose}
    anchorReference="anchorPosition"
    anchorPosition={
      contextMenu !== null
        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
        : undefined
    }
  >
    <MenuItem onClick={() => handleReply(contextMenu.message)}>Reply</MenuItem>
    <MenuItem onClick={() => handleCopy(contextMenu.message)}>Copy</MenuItem>
    <MenuItem onClick={() => handleDelete(contextMenu.message)}>Delete</MenuItem>
  </Menu>
);

  const handleRightClick = (event, message) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      message: message,
    });
  };
  
  const handleAttachment = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch('http://localhost:4000/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          const fileMsg = file.type.startsWith('image/') ? {
            sender: username,
            image: URL.createObjectURL(file), // For local preview
            URL: data.url, // URL of the uploaded image
            timestamp: new Date().toISOString(),
          } : {
            sender: username,
            text: `Sent a file: ${file.name}`,
            fileType: 'file',
            fileName: file.name,
            timestamp: new Date().toISOString(),
            URL: data.url, // URL of the uploaded file
          };
  
          setMessages((prevMessages) => [...prevMessages, fileMsg]);
          socket.emit('sendMessage', fileMsg);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    if (now.getDate() - date.getDate() === 1) {
      return 'Yesterday';
    }
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className={classes.chatContainer}>
      <Typography variant="h6" className={classes.header}>{username}</Typography>
      <Paper className={classes.messageContainer}>
        <Grid container>
          <RenderContextMenu />
          {messages.map((msg, index) => (
            <Grid key={index} item xs={12} className={classes.messageRow}>
            <div style={{ textAlign: msg.sender === username ? 'right' : 'left' }}>
                <div style={{ marginBottom: theme.spacing(1), display: 'inline-block' }}> {/* Added display: inline-block */}
                  <Typography variant="caption" style={{ color: 'grey' }}>
                    {msg.sender === username ? "Me" : msg.sender}
                  </Typography>
                </div>
                {msg.replyTo && (
                  <div className={classes.replyOrigin} style={{ display: 'inline-block' }}> {/* Added display: inline-block */}
                    <span className={`material-icons-outlined ${classes.iconRotated}`}>reply</span>
                    <Typography variant="caption" style={{ color: 'lightgrey' }}>
                      {msg.replyTo.sender === username ? "Me" : msg.replyTo.sender}: {msg.replyTo.text}
                    </Typography>
                  </div>
                )}
            </div>
             
            <Box 
                      className={`${classes.messageBubble} ${msg.sender === username ? classes.sentMessage : classes.receivedMessage}`}
                      onContextMenu={(e) => handleRightClick(e, msg)}
                      >
                        {msg.image ? (
                          <>
                            <img 
                        src={msg.image} 
                        alt="Uploaded" 
                        style={{ maxWidth: '60%', maxHeight: '100px' }} 
                      />
                      {msg.URL && !downloadedImages[msg.URL] ? (
                      <IconButton
                        color="primary"
                        href={msg.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        onClick={() => setDownloadedImages({ ...downloadedImages, [msg.URL]: true })}
                      >
                      <span class="material-symbols-outlined">download</span>
                      </IconButton>
                      ) : msg.URL && downloadedImages[msg.URL] ? (
                      <IconButton disabled>
                        <CheckIcon />
                      </IconButton>
                      ) : null}
                      </>
                      ) : msg.fileType === 'file' ? (
                      <div>
                      <Typography variant="caption">{msg.text}</Typography> 
                      {msg.URL && (
                      <Button
                        color="primary"
                        href={msg.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                      <span class="material-symbols-outlined">download</span>
                      </Button>
                      )}
                    </div>
                      ) : (
                        <Typography variant="caption">{msg.text}</Typography> 
                      )}
                      
            </Box>
                  <Typography variant="caption"
                    className={`${classes.timestamp} ${msg.sender === username ? classes.sentMessage : classes.receivedMessage}`}
                  >
                    {formatTimestamp(msg.timestamp)}
                  </Typography>

            </Grid>
          ))}
        </Grid>
        {/* Typing Indicator */}
      {typingUser && typingUser !== username && (
        <Grid item xs={12} style={{ textAlign: 'left' }}>
          <Box className={classes.messageBubble}>
            <span className="material-icons-outlined typing-icon">chat</span>
            <Typography variant="caption" className={classes.typingIndicator}>
              {`${typingUser} is typing...`}
            </Typography>
          </Box>
        </Grid>
      )}
 
    <ReplyView />
      </Paper>
      <TextField
        label="Type a message"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className={classes.inputField}
        InputProps={{
        startAdornment: (
        <InputAdornment position="start">
        <input
          accept="image/*, .pdf, .doc, .docx, .txt"
          style={{ display: 'none' }}
          id="icon-button-file"
          type="file"
          onChange={handleAttachment}
        />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" component="span" style={{ marginRight: '8px' }}> {/* Added margin here */}
            <span className="material-icons-outlined">upload</span>
          </IconButton>
        </label>
      </InputAdornment>
    ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={sendMessage} className={classes.sendButton}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default Chat;