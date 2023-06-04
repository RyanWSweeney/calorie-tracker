import React, {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Button, Typography, Link} from "@mui/material";

const Register = () => {
    const paperStyle = {padding: 20, height: 'fit-content', width: 280, margin: "20px auto"};
    const avatarStyle = {backgroundColor: '#1bbd7e', padding: 10};
    const textStyle = {margin: '6px 0'};
    const btnStyle = {margin: '4px 0'};
    const errorStyle = {color: 'red', fontSize: '12px', margin: '0px 0px 0px 0px'};

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [city, setCity] = React.useState('');
    const [state, setState] = React.useState('');
    const [zip, setZip] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [country, setCountry] = React.useState('');

    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [zipError, setZipError] = useState<string | null>(null);
    const [stateError, setStateError] = useState<string | null>(null);
    const [countryError, setCountryError] = useState<string | null>(null);

    const navigate = useNavigate();
    const validate = require('validator');

    const validateEmail = (email: string) => {
        if(!validate.isEmail(email)) {
            return false;
        }
        return true;
    }

    const validatePhone = (phone: string) => {
        if(!validate.isMobilePhone(phone)) {
            return false;
        }
        return true;
    }

    const validateZip = (zip: string) => {
        if(!validate.isPostalCode(zip, "US")) {
            return false;
        }
        return true;
    }

    const validateState = (state: string) => {
        if(!validate.isAlpha(state)) {
            return false;
        }
        return true;
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const email = event.target.value as string;
        setEmail(email);
        if(!validateEmail(email)) {
            setEmailError("Invalid email");
        }else{
            setError(null);
            setEmailError(null);
        }
    }

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPhone(event.target.value);
        if(!validatePhone(event.target.value)) {
            setPhoneError("Invalid phone number");
        }else{
            setError(null);
            setPhoneError(null);
        }
    }

    const handleZipChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setZip(event.target.value);
        if(!validateZip(event.target.value)) {
            setZipError("Invalid zip code");
        }else{
            setError(null);
            setZipError(null);
        }
    }

    const handleStateChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setState(event.target.value);
        if(!validateState(event.target.value)) {
            setStateError("Invalid state");
        }else{
            setError(null);
            setStateError(null);
        }
    }

    const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCountry(event.target.value);
        setCountryError("This app only supports the United States");
    }

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(username, password, email, firstName, lastName, address, city, state, zip, phone, country)
        console.log("Register")
        //check to make sure no errors
        if(emailError != null || phoneError != null || zipError != null || stateError != null) {
            console.log("Error")
            setError("Please fix errors");
            return;
        }

        // You can now use these values to authenticate the user
        try {
            const response = await fetch('http://' + process.env.REACT_APP_IP + '/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    firstName,
                    lastName,
                    address,
                    city,
                    state,
                    zip,
                    phone,
                    country
                }),
                credentials: 'include', // Required to include the cookie
            });

            if (!response.ok) {
                setError('Register failed, Email or Username already exists');
                throw new Error('Register failed');
            }

            const data = await response.json();
            console.log(data)
            if (data.status === 'success') {
                // sessionStorage.setItem('token', data.token);
                navigate('/login');
            } else {
                console.log(data)
                setError('Register failed');
                throw new Error('Register failed');
            }
        } catch (error) {
            // Handle the error
            console.error('Error:', error);
        }
    }
    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid container direction='column' alignItems='center' >
                    <Avatar style={avatarStyle}>R</Avatar>
                    <h2>Register</h2>
                    <form onSubmit={handleRegister}>
                        <TextField
                            label='Username'
                            placeholder='Enter username'
                            fullWidth
                            required
                            onChange={(event) => setUsername(event.target.value)}
                            style={textStyle}
                        />
                        <TextField
                            label='Password'
                            placeholder='Enter password'
                            type='password'
                            fullWidth
                            required
                            onChange={(event) => setPassword(event.target.value)}
                            style={textStyle}
                        />
                        <TextField
                            label='Email'
                            placeholder='Enter email'
                            fullWidth
                            required
                            error={emailError !== null}
                            helperText={emailError}
                            onChange={(event) => handleEmailChange(event)}
                            style={textStyle}
                        />
                        <TextField
                            label='First Name'
                            placeholder='Enter first name'
                            fullWidth
                            required
                            onChange={(event) => setFirstName(event.target.value)}
                            style={textStyle}
                        />
                        <TextField
                            label='Last Name'
                            placeholder='Enter last name'
                            fullWidth
                            required
                            onChange={(event) => setLastName(event.target.value)}
                            style={textStyle}
                        />
                        <TextField
                            label='Address'
                            placeholder='Enter address'
                            fullWidth
                            required
                            onChange={(event) => setAddress(event.target.value)}
                            style={textStyle}
                        />
                        <TextField
                            label='City'
                            placeholder='Enter city'
                            fullWidth
                            required
                            onChange={(event) => setCity(event.target.value)}
                            style={textStyle}
                        />
                        <TextField
                            label='State'
                            placeholder='Enter state'
                            fullWidth
                            required
                            error={stateError !== null}
                            helperText={stateError}
                            onChange={(event) => handleStateChange(event)}
                            style={textStyle}
                        />
                        <TextField
                            label='Zip'
                            placeholder='Enter zip'
                            fullWidth
                            required
                            error={zipError !== null}
                            helperText={zipError}
                            onChange={(event) => handleZipChange(event)}
                            style={textStyle}
                        />
                        <TextField
                            label='Phone'
                            placeholder='Enter phone'
                            fullWidth
                            required
                            error={phoneError !== null}
                            helperText={phoneError}
                            onChange={(event) => handlePhoneChange(event)}
                            style={textStyle}
                        />
                        <TextField
                            label='Country'
                            placeholder='Enter country'
                            value={'United States'}
                            fullWidth
                            required
                            error={countryError !== null}
                            helperText={countryError}
                            InputLabelProps={{ shrink: true }}
                            onChange={(event) => handleCountryChange(event)}
                            style={textStyle}
                        />
                        <Button
                            type='submit'
                            color='primary'
                            variant='contained'
                            fullWidth
                            style={btnStyle}
                        >Register</Button>
                        <Typography style={errorStyle}>{error}</Typography>
                    </form>
                    <Typography style={textStyle}>Already have an account?
                        <div> </div>
                        <Link href='/login'>
                             Login
                        </Link>
                    </Typography>

                </Grid>
            </Paper>
        </Grid>
    );
};
export default Register;
