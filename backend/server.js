const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Use cookie-parser middleware
app.use(cors({origin: true, credentials: true}));

// Use cors middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
//secret key is stored in file called SECRET_KEY.txt
//open file and save secret
const fs = require('fs');
const SECRET_KEY = fs.readFileSync('./SECRET_KEY', 'utf8');

app.use(express.json());

function authenticate(req, res) {
    const { username, password } = req.body;
    // This is a mocked function, replace it with actual validation
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
        // If login details are valid, respond with success
        res.status(200).json({ status: 'success', token: token });
    } else {
        // If login details are invalid, respond with error
        res.status(403).json({ status: 'error', message: 'Invalid username or password' });
    }
}

app.use((req, res, next) => {
    if (req.user) {
        console.log(`User ${req.user.username} made a request`);
    } else {
        console.log('Unauthenticated request');
    }
    next();
});

// Login route
app.post('/api/login', (req, res) => {
    console.log(req.body)
    authenticate(req, res);
});

// Logout route
app.post('/api/logout', (req, res) => {
    req.session.destroy(); // Destroy session when user logs out
    res.send('Logged out');
});



app.listen(9229, () => console.log('API is listening on port 9229'));
