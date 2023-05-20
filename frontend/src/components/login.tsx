import React from "react";
import {Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Button, Typography, Link} from "@material-ui/core";
import LockIcon from '@mui/icons-material/Lock';
const Login = () => {
    const paperStyle = {padding: 20, height: '70vh', width: 280, margin: "20px auto"};
    const avatarStyle = {backgroundColor: '#1bbd7e', padding: 10};
    const textStyle = {margin: '8px 0'};
    const btnStyle = {margin: '8px 0'};
  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
          <Grid container direction='column' alignItems='center' >
            <Avatar style={avatarStyle}><LockIcon/></Avatar>
            <h2>Sign In</h2>
              <TextField label="username" variant={"standard"} placeholder={"Enter Username"} style={textStyle} fullWidth required></TextField>
              <TextField label="password" variant={"standard"} placeholder={"Enter Password"} type={"password"} style={textStyle} fullWidth required></TextField>

          </Grid>
          <FormControlLabel control={<Checkbox name="remember" />} label={"Remember Me"} />
          <Button type={"submit"} color={"primary"} variant={"contained"} style={btnStyle} fullWidth>Sign In</Button>
          <Typography style={textStyle}>
                <Link href="#">Forgot Password</Link>
          </Typography>
          <Typography style={textStyle}> Are you new here?
                <Link href="#"> Sign Up</Link>
          </Typography>

      </Paper>
    </Grid>
  );
};

export default Login;