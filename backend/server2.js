const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose').default;
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const fs = require('fs');
const PASSWORD = fs.readFileSync('./PASSWORD', 'utf8');

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
    credentials: true
}));

app.use(express.json());
//read secret from SECRE_KEY
const secret = fs.readFileSync('./SECRET_KEY', 'utf8');
app.use(session({secret: secret, resave: false, saveUninitialized: true}));

passport.use('local', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        User.findOne({ email: email }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            bcrypt.compare(password, user.password, function(err, res) {
                if (err) return done(err);
                if (res === false) {
                    return done(null, false, { message: 'Incorrect password.' });
                } else {
                    return done(null, user);
                }
            });
        });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//routes
//Login route
app.post('/api/login', passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true }));

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
    try {
        await user.save();
        res.status(201).json({ status: 'success', message: 'User created' });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});


app.listen(9229, '0.0.0.0', () => console.log('Server started on port 9229'));