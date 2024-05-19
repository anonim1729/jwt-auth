const User = require('../models/User');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;
const bcrypt = require('bcrypt');

const createToken = async (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: maxAge
    });
}

const handleErrors = (err) => {
    // console.log(err.message, err.code)
    let errors = { email: '', password: '' };

    //incorrect email
    if (err.message == "Incorrect email") {
        errors.email = "Email is not registered";
    }
    if (err.message == "Incorrect password") {
        errors.password = "Incorrect password";
    }
    if (err.code == 11000) {
        errors.email = "email already registered ,please log in";
        return errors;
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
            // console.log(properties.path, properties.message)
        })
    }

    return errors;
}

const getSignUp = async (req, res) => {
    res.render('signup');
}
const postSignUp = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        const token = await createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        if (!user) {
            res.send("something wrong with the data");
        }
        // console.log(token);
        res.status(201).json({ id: user._id });
    }
    catch (e) {
        const errors = handleErrors(e);
        res.status(400).json({ errors });
    }
}
const getLogin = async (req, res) => {
    res.render('login');
}
const postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = await createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ id: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const getLogOut = (req, res) => {
    res.cookie('jwt', "", { maxAge: 1 });
    res.redirect('/');
}

module.exports = { getSignUp, postSignUp, getLogin, postLogin, getLogOut };