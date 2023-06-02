import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Grid, Paper, TextField} from "@mui/material";

const paperStyle = {padding: 20, height: '70vh', width: 280, margin: "20px auto"};
const textStyle = {margin: '8px 0'};



export const ResetPassword = () => {
    const [username, setUsername] = useState('');
    return(
    <Grid>
        <Paper elevation={10} style={paperStyle}>
            <h2>Reset Password</h2>
            <form>
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