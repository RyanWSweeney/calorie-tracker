import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Grid, Paper, TextField} from "@mui/material";

const paperStyle = {padding: 20, height: '70vh', width: 280, margin: "20px auto"};
const textStyle = {margin: '8px 0'};



export const ResetPassword = () => {

    const handleReset = async (event: any) => {

        event.preventDefault();
        console.log("Reset Password");
        try{
            const response = await fetch('http://' + process.env.REACT_APP_IP + '/api/resetPassword', {
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
                //redirect to password reset page and save jwt token that validates this transaction
                sessionStorage.setItem('pass-token', data.token);
                navigate('/resetPassword');
            }
        }
        catch(error){
            console.error('Error:', error);
        }
    }

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
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
        </Paper>
    </Grid>);
}

export default ResetPassword;