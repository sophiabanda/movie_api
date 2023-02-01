const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      Models = require('./models.js'),
      passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

    passport.use(new LocalStrategy({
        //HTTP auth for login. Takes username and passwrd from user body, uses mongoose to check db for same name.
        usernameField: 'Name',
        passwordField: 'Password'
    }, (username, password, callback) => {
        console.log(`${username} ${password}`);
        Users.findOne( { Name: username }, (error, user) => {
            if (error) {
                console.log(error);
                return callback(error);
            }
            if (!user.validatePassword(password)) {
                console.log('Incorrect username');
                return callback(null, false, {message: 'Incorrect username or password.'})
            }
            console.log('finished');
            return callback(null, user);
        });
     }));

     passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_jwt_secret'
     }, (jwtPayload, callback) => {
        return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
     }));