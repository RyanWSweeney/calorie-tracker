import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {Button, TextField} from "@mui/material";


export const PasswordResetBody = ({token} : {token : string}) => {
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const navigate = useNavigate();

    const errorStyle = {color: "red"};

    const handleSubmit = async (evt: any) => {
        evt.preventDefault();
        //compare passwords
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        } else {
            setError("");
            try {
                const response = await fetch('http://' + process.env.REACT_APP_IP + '/api/resetPassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({password, token})
                })

                if (!response.ok) {
                    setError("Password reset failed");
                    throw new Error('Password reset failed');
                }
                const data = await response.json();
                if (data.status === 'success') {
                    navigate('/login');
                } else {
                    setError("Password reset failed");
                    throw new Error('Password reset failed');
                }
            } catch (error) {
                // Handle the error
                console.error('Error:', error);
            }
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <TextField label={"Password"} type={"password"} value={password} required
                           onChange={e => setPassword(e.target.value)}/>
                <TextField label={"Confirm Password"} type={"password"} value={confirmPassword} required
                           onChange={e => setConfirmPassword(e.target.value)}/>
                <Button type={"submit"}>Submit</Button>
            </form>
            <p style={errorStyle}>{error}</p>
        </div>
    )
}

export default PasswordResetBody;