const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose').default;
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const nodemailer = require('nodemailer');

const jwt = require("jsonwebtoken");
const {ObjectId} = require("mongodb");

require('dotenv').config();

password = process.env.PASSWORD;
secret = process.env.SECRET_KEY;

const uri = "mongodb+srv://rsweeney:" + password + "@user-data-calorie-track.edtqlmi.mongodb.net/userinfo?retryWrites=true&w=majority";

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
    origin: 'http://' + process.env.FRONTEND_URL,
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

app.post('/api/reqNewPassword', async (req, res) => {
    const { username } = req.body;
    // find user from mongo
    const user = await db.collection('users').findOne({username: username});
    if (user) {
        console.log("Username exists");
        //generate jwt with userid of user from mongodb
        const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '1h' }); // Consider adding expiration to this token

        // Send the token to the user's email address as a password reset link
        let transporter = nodemailer.createTransport({
            host: 'mail.ryansweeney.org',
            port : 465,
            secure: true,
            auth: {
                user: process.env.EMAIL, // your email
                pass: process.env.EMAIL_PASSWORD  // your email password
            }
        });

        let mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset Link',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
                   http://${process.env.FRONTEND_URL}/resetPassword/${token}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('there was an error: ', err);
            } else {
                console.log('here is the res: ', response);
                res.status(200).json({status: 'success', message: 'recovery email sent'});
            }
        });

    } else {
        res.status(400).json({ status: 'error', message: 'Username does not exist' });
    }
});

app.post('/api/verifyPasswordReset', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secret);
        if(decoded.exp < Date.now() / 1000) {
            res.status(400).json({ status: 'error', message: 'Token expired' });
        } else {
            res.status(200).json({ status: 'success', message: 'Token valid' });
        }
    } catch (err) {
        res.status(400).json({ status: 'error', message: 'Invalid token' });
    }
});

app.post('/api/resetPassword', async (req, res) => {
    const { password, token } = req.body;
    try {
        const decoded = jwt.verify(token, secret);
        const hash = await bcrypt.hash(password, 10);
        const result = await db.collection('users').updateOne({_id: new ObjectId(decoded._id)}, {$set: {password: hash}});
        console.log(result);
        if(result.modifiedCount === 0) {
            res.status(400).json({ status: 'error', message: 'Password not updated' });
        }else{
            res.status(200).json({ status: 'success', message: 'Password updated' });
        }
    }catch (err) {
        console.log(err);
        res.status(400).json({ status: 'error', message: 'Invalid token' });
    }
});

app.post('/api/validateToken', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, secret);
        console.log(decoded);
        const user = await db.collection('users').find({_id: decoded._id});
        // console.log(user);
        if (user) {
            return res.status(200).json({ status: 'success', message: 'Token is valid' });
        } else {
            return res.status(401).json({ status: 'error', message: 'Token is invalid' });
        }
    } catch (err) {
        return res.status(401).json({ status: 'error', message: 'Token is invalid' });
    }
});

app.get('/api/userInfo', async (req, res) => {
    try {
        //validate token
        const token = req.headers.authorization?.split(' ')[1];
        console.log('in userInfo');
        if (!token) {
            return res.status(401).json({status: 'error', message: 'No token provided'});
        }
        const decoded = jwt.verify(token, secret);
        console.log(decoded);
        console.log(decoded._id);
        const user = await db.collection('users').findOne({_id: new ObjectId(decoded._id)});
        if (user) {
            return res.status(200).json({status: 'success', message: 'Token is valid', user: user});
        } else {
            console.log('User not found');
            return res.status(401).json({status: 'error', message: 'User not found'});
        }
    } catch (err) {
        console.log('Token is invalid');
        console.log(err);
        return res.status(401).json({status: 'error', message: 'Token is invalid'});
    }
});

app.listen(9229, '0.0.0.0', () => console.log('Server started on port 9229'));