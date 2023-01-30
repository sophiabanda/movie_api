const jwtSecret = 'your_jwt_secret';
//This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
      passport = requre('passport');

require('./passport');

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, //This is the name you're encoding in the JWT --- Should this be 'Name' in my case?
        expiresIn: '7d', //Sets expiry at 7 days
        algorithm: 'HS256' //This is the algorithm used to “sign” or encode the values of the JWT
    });
}

//POST login
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', {session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                })
            }
            req.login(user, {session: false}, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json( { user, token });
            })
        }) (req, res);
    })
}

