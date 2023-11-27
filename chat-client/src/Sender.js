import React, { useState } from 'react';
import socketIOClient from 'socket.io-client';
import { TextField, Button, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  form: {
    margin: theme.spacing(2),
  },
  inputField: {
    marginRight: theme.spacing(2),
  }
}));

const ENDPOINT = "http://localhost:4000";
const socket = socketIOClient(ENDPOINT);

const Sender = () => {
    const classes = useStyles();
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (message) {
            socket.emit('sendMessage', message);
            setMessage('');
        }
    };

    return (
        <div className={classes.form}>
            <Grid container alignItems="center">
                <Grid item xs={10}>
                    <TextField
                        label="Type a message"
                        variant="outlined"
                        fullWidth
                        className={classes.inputField}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={sendMessage}
                    >
                        Send
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default Sender;
