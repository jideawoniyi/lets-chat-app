// Login.js
import React, { useState } from 'react';
import { TextField, Button, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    marginBottom: theme.spacing(2),
  },
}));

const Login = ({ onLogin, userType }) => {
  const [username, setUsername] = useState('');
  const classes = useStyles();

  const handleLogin = () => {
    if (username) {
      onLogin(username);
    }
  };

  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <TextField
          label={`Enter your ${userType} username`}
          variant="outlined"
          className={classes.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Enter Chat as {userType}
        </Button>
      </Paper>
    </div>
  );
};

export default Login;
