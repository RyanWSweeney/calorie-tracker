import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import withAuth  from "./withAuth";
import {Button, Grid, Paper, TextField, Typography} from "@mui/material";

interface UserInfo {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    country: string;
}
const UserInfo: React.FunctionComponent = () => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [zipError, setZipError] = useState<string | null>(null);
    const [stateError, setStateError] = useState<string | null>(null);
    const [countryError, setCountryError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const widePaperStyle = {padding: 20, height: '95vh', width: 280, margin: "20px auto"};
    const fieldStyle = {margin: '8px 0'};

    const navigate = useNavigate();
    const validator = require('validator');

    const handleUserInfoChange = (field: keyof UserInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if(field === "email") {
            if(!validateEmail(event.target.value)) {
                setEmailError("Invalid email");
            }else{
                setEmailError(null);
            }
        }
        if(field === "phone") {
            if(!validatePhone(event.target.value)) {
                setPhoneError("Invalid phone number");
            }else{
                setPhoneError(null);
            }
        }
        if(field === "zip") {
            if(!validateZip(event.target.value)) {
                setZipError("Invalid zip code");
            }else{
                setZipError(null);
            }
        }
        if(field === "state") {
            if(!validateState(event.target.value)) {
                setStateError("Invalid state");
            }else{
                setStateError(null);
            }
        }
        setUser((prevUser) => ({
            ...prevUser,
            [field]: event.target.value
        }) as UserInfo);
    }

    const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //set an error if the user tries to change the data
        setUsernameError("You cannot change your username");
    }

    const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //set an error if the user tries to change the data
        setCountryError("This app only supports the United States");
    }

    const validateEmail = (email: string) => {
        if(!validator.isEmail(email)) {
            return false;
        }
        return true;
    }

    const validatePhone = (phone: string) => {
        if(!validator.isMobilePhone(phone)) {
            return false;
        }
        return true;
    }

    const validateZip = (zip: string) => {
        if(!validator.isPostalCode(zip, 'US')) {
            return false;
        }
        return true;
    }

    const validateState = (state: string) => {
        if(!validator.isAlpha(state)) {
            return false;
        }
        return true;
    }

    useEffect(() => {
        fetch('http://' + process.env.REACT_APP_IP + '/api/userInfo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => setUser(data.user))
            .catch(error => console.error('Error fetching user info', error));
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //make sure no errors are present
        if(emailError !== null || phoneError !== null || zipError !== null || stateError !== null) {
            setError("Please fix the errors");
            return;
        }
        // Perform your request to the server here, for example:
        const response = await fetch('http://' + process.env.REACT_APP_IP + '/api/updateUserInfo', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        // Navigate away after successful submission
        if (response.ok) {
            navigate('/dashboard');
        }else if(response.status === 401) {
            setError("You are not authorized to do that");
        }else if (response.status === 400) {
            const data = await response.json();
            setError(data.message);
        }else{
            setError("Unknown error");
        }
    }

    return (
        <div>
            <Grid>
                <Paper style={widePaperStyle}>
                    <h1>Change User Info</h1>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            value={user.username}
                            style={fieldStyle}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            error={usernameError !== null}
                            helperText={usernameError}
                            onChange={handleUserNameChange}
                        />
                        <TextField
                            label={'Email'}
                            value={user.email}
                            style={fieldStyle}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            error={emailError !== null}
                            helperText={emailError}
                            onChange={handleUserInfoChange('email')}
                        />
                        <TextField
                            label={'First Name'}
                            value={user.firstName}
                            style={fieldStyle}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            onChange={handleUserInfoChange('firstName')}
                        />
                        <TextField
                            label={'Last Name'}
                            value={user.lastName}
                            style={fieldStyle}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            onChange={handleUserInfoChange('lastName')}
                        />
                        <TextField
                            label={'Address'}
                            value={user.address}
                            style={fieldStyle}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            onChange={handleUserInfoChange('address')}
                        />
                        <TextField
                            label={'City'}
                            value={user.city}
                            style={fieldStyle}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            onChange={handleUserInfoChange('city')}
                        />
                        <TextField
                            label={'State'}
                            value={user.state}
                            style={fieldStyle}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            error={stateError !== null}
                            helperText={stateError}
                            onChange={handleUserInfoChange('state')}
                        />
                        <TextField
                            label={'Zip'}
                            value={user.zip}
                            style={fieldStyle}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            error={zipError !== null}
                            helperText={zipError}
                            onChange={handleUserInfoChange('zip')}
                        />
                        <TextField
                            label={'Phone'}
                            value={user.phone}
                            style={fieldStyle}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            error={phoneError !== null}
                            helperText={phoneError}
                            onChange={handleUserInfoChange('phone')}
                        />
                        <TextField
                            label={'Country'}
                            value={user.country}
                            style={fieldStyle}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            error={countryError !== null}
                            helperText={countryError}
                            onChange={handleCountryChange}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
                        <Typography color="error">{error}</Typography>
                    </form>
                </Paper>
            </Grid>
        </div>
    );
}

export default withAuth(UserInfo);