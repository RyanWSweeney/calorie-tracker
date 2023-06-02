import React, {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Avatar, Grid, Paper, TextField, Checkbox, FormControlLabel, Button, Typography, Link} from "@mui/material";

const Register = () => {
    const paperStyle = {padding: 20, height: '95vh', width: 280, margin: "20px auto"};
    const avatarStyle = {backgroundColor: '#1bbd7e', padding: 10};
    const textStyle = {margin: '8px 0'};
    const btnStyle = {margin: '8px 0'};

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

    const navigate = useNavigate();

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(username, password, email, firstName, lastName, address, city, state, zip, phone, country)
        console.log("Register")
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
                throw new Error('Register failed');
            }

            const data = await response.json();
            console.log(data)
            if (data.status === 'success') {
                console.log("Login success")
                // sessionStorage.setItem('token', data.token);
                navigate('/login');
            } else {
                console.log(data)
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
                        <TextField label='Username' placeholder='Enter username' fullWidth required
                                      onChange={(event) => setUsername(event.target.value)}/>
                        <TextField label='Password' placeholder='Enter password' type='password' fullWidth required
                                        onChange={(event) => setPassword(event.target.value)}/>
                        <TextField label='Email' placeholder='Enter email' fullWidth required
                                        onChange={(event) => setEmail(event.target.value)}/>
                        <TextField label='First Name' placeholder='Enter first name' fullWidth required
                                        onChange={(event) => setFirstName(event.target.value)}/>
                        <TextField label='Last Name' placeholder='Enter last name' fullWidth required
                                        onChange={(event) => setLastName(event.target.value)}/>
                        <TextField label='Address' placeholder='Enter address' fullWidth required
                                        onChange={(event) => setAddress(event.target.value)}/>
                        <TextField label='City' placeholder='Enter city' fullWidth required
                                        onChange={(event) => setCity(event.target.value)}/>
                        <TextField label='State' placeholder='Enter state' fullWidth required
                                        onChange={(event) => setState(event.target.value)}/>
                        <TextField label='Zip' placeholder='Enter zip' fullWidth required
                                        onChange={(event) => setZip(event.target.value)}/>
                        <TextField label='Phone' placeholder='Enter phone' fullWidth required
                                        onChange={(event) => setPhone(event.target.value)}/>
                        <TextField label='Country' placeholder='Enter country' fullWidth required
                                        onChange={(event) => setCountry(event.target.value)}/>
                        <Button type='submit' color='primary' variant='contained' fullWidth style={btnStyle}>Register</Button>
                    </form>
                </Grid>
            </Paper>
        </Grid>
    );
};
export default Register;
