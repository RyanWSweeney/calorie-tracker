import React, {FormEvent, useState} from "react";
import {Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Button, Typography, Link} from "@material-ui/core";
import LockIcon from '@mui/icons-material/Lock';
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

interface LoginProps {
    onLogin: () => void;
}
const Login = (props : LoginProps) => {
    const paperStyle = {padding: 20, height: '70vh', width: 280, margin: "20px auto"};
    const avatarStyle = {backgroundColor: '#1bbd7e', padding: 10};
    const textStyle = {margin: '8px 0'};
    const btnStyle = {margin: '8px 0'};

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    // Function to handle form submission
    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();
        console.log(username, password)
        console.log("Login")
        // You can now use these values to authenticate the user
        try {
            const response = await fetch('http://localhost:9229/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include', // Required to include the cookie
            });

            // if (!response.ok) {
            //     throw new Error('Login failed');
            // }

            const data = await response.json();
            console.log(data)
            if(data.status === 'success') {
                // console.log("Login success")
                sessionStorage.setItem('token', data.token);
                props.onLogin();
                navigate('/dashboard');
            }else{
                throw new Error('Login failed');
            }

        } catch (error) {
            // Handle the error
            console.error('Error:', error);
        }
    };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
          <form onSubmit={handleLogin}>
          <Grid container direction='column' alignItems='center' >
            <Avatar style={avatarStyle}><LockIcon/></Avatar>
            <h2>Sign In</h2>
              <TextField
                  label="username"
                  variant={"standard"}
                  placeholder={"Enter Username"}
                  style={textStyle}
                  fullWidth
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}>
              </TextField>
              <TextField
                  label="password"
                  variant={"standard"}
                  placeholder={"Enter Password"}
                  type={"password"}
                  style={textStyle}
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}>
              </TextField>

          </Grid>
          <FormControlLabel control={<Checkbox name="remember" />} label={"Remember Me"} />
          <Button type={"submit"} color={"primary"} variant={"contained"} style={btnStyle} fullWidth>Sign In</Button>
          <Typography style={textStyle}>
                <Link href="#">Forgot Password</Link>
          </Typography>
          <Typography style={textStyle}> Are you new here?
                <Link href="#"> Sign Up</Link>
          </Typography>
          </form>
      </Paper>
    </Grid>
  );
};

export default Login;