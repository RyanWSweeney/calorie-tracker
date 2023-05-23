const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose').default;
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const fs = require('fs');
const jwt = require("jsonwebtoken");
const PASSWORD = fs.readFileSync('./PASSWORD', 'utf8');
//read secret from SECRE_KEY
const secret = fs.readFileSync('./SECRET_KEY', 'utf8');

const uri = "mongodb+srv://rsweeney:" + PASSWORD + "@user-data-calorie-track.edtqlmi.mongodb.net/userinfo?retryWrites=true&w=majority";

const app = express();

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.error('Error connecting to database', error);
});

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

app.use(cors({
    origin: 'http://192.168.1.78:3000',
    optionsSuccessStatus: 200,
    credentials: true,
}));

app.use(express.json());

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    async function (username, password, done) {
        console.log('local strategy');
        await db.collection('users').findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('Incorrect email');
                return done(null, false, {message: 'Incorrect email or password.'});
            }

            bcrypt.compare(password, user.password, function (err, res) {
                if (err) return done(err);
                if (res === false) {
                    console.log('Incorrect password');
                    return done(null, false, {message: 'Incorrect emaile or password'});
                } else {
                    //return user if password matches
                    console.log('correct password');
                    return done(null, user);
                }
            });
        });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
    await db.collection('users').findOne({_id: id}, function (err, user) {
        done(err, user);
    });
});

//routes
//Login route
app.post ("/api/login", passport.authenticate('local'), (req, res) => {
    console.log("login route");
    console.log(req.body);
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    //generate jwt token
    const token = jwt.sign({ _id: req.user._id }, secret);
    res.json({ status: 'success', message: 'Authenticated successfully', token: token });
});
//Logout route
app.get('/api/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

//register route
app.post('/api/register', async (req, res) => {
    const { username, password, email, phone, address, city, state, zip, country } = req.body;
    console.log(req.body)
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash, email, phone, address, city, state, zip, country });
    //check if username or email already exists
    if(await db.collection('users').find({$or: [{username: username}, {email: email}]}).count() > 0) {
        console.log("Username or email already exists")
        res.status(400).json({ status: 'error', message: 'Username or email already exists' });
        return;
    }
    try {
        await user.save();
        res.status(201).json({ status: 'success', message: 'User created' });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

app.post('/api/validateToken', async (req, res) => {
    const token = req.body.token;
    console.log(token);
    if (!token) {
        res.status(401).json({ status: 'error', message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, secret);
        const user = await db.collection('users').findOne({_id: decoded._id});
        if (user) {
            res.status(200).json({ status: 'success', message: 'Token is valid' });
        } else {
            res.status(401).json({ status: 'error', message: 'Token is invalid' });
        }
    } catch (err) {
        res.status(401).json({ status: 'error', message: 'Token is invalid' });
    }
});


app.listen(9229, '0.0.0.0', () => console.log('Server started on port 9229'));