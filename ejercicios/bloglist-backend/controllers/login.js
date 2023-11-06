const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const loginRouter = require('express').Router();
const config = require('../utils/config');

loginRouter.post('/', async (request, response, next) => {
    
    try {
        const body = request.body;
        // console.log("🚀 ~ file: login.js:11 ~ loginRouter.post ~ body:", body)
        const user = await User.findOne({ username: body.username });
        // console.log("🚀 ~ file: login.js:13 ~ loginRouter.post ~ user", user)
        const passwordCorrect = user === null
            ? false
            : await bcrypt.compare(body.password, user.passwordHash);
    
        if (!(user && passwordCorrect)) {
            return response.status(401).json({
                error: 'invalid username or password'
            })
        }
    
        const userForToken = {
            username: user.username,
            id: user._id
        }
        
        const token = jwt.sign(userForToken, config.SECRET);
        response.status(200).json({ token, username: user.username, name: user.name })
    
    } catch (error) {
        next(error)
    }

})

module.exports = loginRouter;