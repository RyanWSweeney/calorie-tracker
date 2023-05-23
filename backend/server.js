const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose').default;

const fs = require('fs');
const PASSWORD = fs.readFileSync('./PASSWORD', 'utf8');

const uri = "mongodb+srv://rsweeney:" + PASSWORD + "@user-data-calorie-track.edtqlmi.mongodb.net/userinfo?retryWrites=true&w=majority";

const app = express();

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB");
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String,
});

const User = mongoose.model('User', userSchema);


// Use cookie-parser middleware
app.use(cors({origin: true, credentials: true}));

// Use cors middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
//secret key is stored in file called SECRET_KEY.txt
//open file and save secret
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

// Register route
app.post('/api/register', (req, res) => {
    const { username, password, email, phone, address, city, state, zip, country} = req.body;
    //check if email is already in User database
    User.find({email: email}, function(err, docs) {
        if (docs.length){
            res.status(403).json({ status: 'error', message: 'Email already in use' });
        }
        else{
            //check if username is already in User database
            User.find({username: username}, function(err, docs) {
                if (docs.length){
                    res.status(403).json({ status: 'error', message: 'Username already in use' });
                }
                else{
                    //create new user
                    const newUser = new User({
                        username: username,
                        password: password,
                        email: email,
                        phone: phone,
                        address: address,
                        city: city,
                        state: state,
                        zip: zip,
                        country: country,
                    });
                    //save user to database
                    newUser.save(function (err, newUser) {
                        if (err) return console.error(err);
                        console.log("New user saved to database");
                    });
                    //create token
                    const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
                    // If login details are valid, respond with success
                    res.status(200).json({ status: 'success', token: token });
                }
            });
        }
    });
});



app.listen(9229, () => console.log('API is listening on port 9229'));
