const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt= require('jsonwebtoken');
const bcrypt= require('bcrypt')


router.get("/login", function(req, res){
    res.render('login')
})

router.get("/register", function(req, res){
    res.render('register')
})

// Registration form submission handler
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let alreadyExists= await User.findOne({email}).lean();
    if(alreadyExists)
        return res.render("register",{
            error: "User already exists."
        })
    let user = await User.create({ username, email, password });
    user= JSON.parse(JSON.stringify(user));
    delete user['password'];
    const authToken = jwt.sign(
        user,
        process.env.JWT_SECRET_KEY
    );

    res.render("index",{
        authToken
    })
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login form submission handler
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.render('login', { error: 'Invalid Email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('login', { error: 'Invalid Password.' });
    }

    delete user['password'];
    const authToken = jwt.sign(
        user,
        process.env.JWT_SECRET_KEY
    );
    
    res.render("index",{
        authToken
    })
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
