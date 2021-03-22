const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const brycpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route GET api/users
// @desc Register user
// @access Public

router.get('/', (req, res) => {
    res.send('Hello ini adalah get user router');
});

router.post('/',
    [
        check('name', 'Name is required')
            .not()
            .isEmpty(),

        check('email', 'Please include a valid email')
            .isEmail(),
        check('password', 'Please enter password with 6 or more characters')
            .isLength({min: 6})
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }


        // console.log('isi body',req.body)
        const {name, email, password} = req.body;

        try {

            // Cheack user and email if ready use...............
            let userName = await User.findOne({name})
            let userEmail = await User.findOne({email})


            if(userName) {
                res.status(400).json({ errors: [{
                    msg: 'User Name already exists'
                    }]});
            }else if (userEmail) {
                res.status(400).json({ errors: [{
                        msg: 'User Email already exists'
                    }]});
            }

            // Get user Avatar........................
            const  avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })


            // Encrypt password..........................
            user = new User({
                name, email, password, avatar
            });

            const salt = await brycpt.genSalt(10);
            user.password = await brycpt.hash(password, salt);

            await user.save();

            // Return jsonwebtoken................
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'),
                { expiresIn: 360000 }, (err, token) => {
                if(err) throw err;
                res.json({ token });
                });


            // console.log(req.body);
            // res.send('User Registered');

        }
        catch (err) {
            console.log(err.massage);
            res.status(500).send('Server error')
        }


    });


module.exports = router;
