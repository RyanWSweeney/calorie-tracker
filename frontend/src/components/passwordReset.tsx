import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import {Grid, Paper} from "@mui/material";
import {PasswordResetBody} from "./passwordResetBody";

const PasswordReset = () => {
    let { token } = useParams(); // This gets the token from the URL
    token = token || "";

    const [isError, setIsError] = useState(false);

    const paperStyle = {padding: 20, height: '70vh', width: 280, margin: "20px auto"};

    useEffect(() => {
        fetch('http://' + process.env.REACT_APP_IP + '/api/verifyPasswordReset', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success') {
                    //display the password reset page
                    setIsError(false);
                }else {
                    //display an error message
                    setIsError(true);
                }
            })
            .catch(error => {
                console.error('Error during token validation', error);
                setIsError(true);
                });
    }, [token]);

    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                {isError ? <h2>Invalid or Expired Token</h2> : <h2>Reset Password</h2>}
                {isError ? <p>Invalid or expired token. Please request a new password reset.</p> : <PasswordResetBody token={token}/>}
            </Paper>
        </Grid>
    );
}

export default PasswordReset;
