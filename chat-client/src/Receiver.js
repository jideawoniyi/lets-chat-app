import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  messageContainer: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    maxHeight: '400px',
    overflowY: 'auto',
  },
  message: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.secondary.light,
    borderRadius: theme.shape.borderRadius,
  }
}));

const ENDPOINT = "http://localhost:4000";
const socket = socketIOClient(ENDPOINT);

const Receiver = () => {
    const classes = useStyles();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    }, []);

    return (
        <Paper className={classes.messageContainer}>
            {messages.map((message, index) => (
                <Typography 
                  key={index} 
                  className={classes.message}
                  variant="body1"
                >
                    {message}
                </Typography>
            ))}
        </Paper>
    );
};

export default Receiver;
