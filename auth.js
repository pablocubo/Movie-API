const jwtSecret = 'Calcetin28'; // This has to be the same key used in the JWTStrategy
const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // Your local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // This is the username you're encoding in the JWT
        expiresIn: '7d', //This specifies that the token will expire in 7 days
        algorithm: 'HS256' // This is the algorithm used to "sign" or encode the values off the JWT
    });
}

/* POST login. */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Invalid credentials',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    return res.status(500).send(error);
                }

                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}
