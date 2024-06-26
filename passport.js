/**
 * Passport authentication setup using LocalStrategy for username/password authentication and JWTStrategy for JSON Web Token authentication.
 * @module PassportAuth
 * @requires passport
 * @requires passport-local
 * @requires ./models.js
 * @requires passport-jwt
 */
const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

    /**
 * Passport middleware using LocalStrategy for username/password authentication.
 * @name LocalStrategyMiddleware
 * @function
 * @param {string} username - The username field from the request.
 * @param {string} password - The password field from the request.
 * @param {function} callback - Callback function to be called after authentication.
 * @returns {Promise} A Promise representing the result of the authentication.
 */
passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username',
            passwordField: 'Password',
        },
        async (username, password, callback) => {
            console.log(`${username} ${password}`);
            await Users.findOne({ Username: username })
                .then((user) => {
                    if (!user) {
                        console.log('incorrect username');
                        return callback(null, false, {
                            message: 'Incorrect username or password.',
                        });
                    }
                    if (!user.validatePassword(password)) {
                        console.log('incorrect password');
                        return callback(null, false, { message: 'Incorrect password' });
                    }
                    console.log('finished');
                    return callback(null, user);
                })
                .catch((error) => {
                    if (error) {
                        console.log(error);
                        return callback(error);
                    }
                })
        }
    )
);

/**
 * Passport middleware using JWTStrategy for JSON Web Token authentication.
 * @name JWTStrategyMiddleware
 * @function
 * @param {object} jwtPayload - The payload of the JWT token.
 * @param {function} callback - Callback function to be called after authentication.
 * @returns {Promise} A Promise representing the result of the authentication.
 */
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));