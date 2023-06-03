import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Grid, Paper, TextField} from "@mui/material";

const paperStyle = {padding: 20, height: '70vh', width: 280, margin: "20px auto"};
const textStyle = {margin: '8px 0'};



export const ResetPassword = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState(''); //display text saying if an account exists with that username, an email has been sent to reset the password


    const handleReset = async (event: any) => {

        event.preventDefault();
        console.log("Reset Password");
        try{
            const response = await fetch('http://' + process.env.REACT_APP_IP + '/api/reqNewPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
                credentials: 'include', // Required to include the cookie
            });

            const data = await response.json();
            console.log(data);
            if(data.status === 'success') {
                //display text saying if an account exists with that username, an email has been sent to reset the password
                setMessage("If an account exists with that username, an email has been sent to reset the password")
            }
        }
        catch(error){
            console.error('Error:', error);
        }
    }
    return(
    <Grid>
        <Paper elevation={10} style={paperStyle}>
            <h2>Reset Password</h2>
            <form onSubmit={handleReset}>
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
                <Button type={"submit"} color={"primary"} variant={"contained"} fullWidth>Reset Password</Button>
            </form>
            <p>{message}</p>
        </Paper>
    </Grid>);
}

export default ResetPassword;