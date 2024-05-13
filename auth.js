/**
 * JSON Web Token (JWT) secret key used for signing and verifying tokens.
 * @constant {string}
 * @default
 */
const jwtSecret = 'your_jwt_secret'; 
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('./passport'); 

/**
 * Function to generate a JWT token for the provided user.
 * @param {object} user - The user object to be encoded in the JWT.
 * @returns {string} JWT token generated for the user.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, 
    expiresIn: '7d', 
    algorithm: 'HS256'
  });
}

 /**
   * Route for user login.
   * @name POSTLoginRoute
   * @function
   * @param {object} req - The request object containing user credentials.
   * @param {object} res - The response object containing authentication details.
   */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Incorrect credentials provided. Try again or create a new user using the /users endpoint.',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        const token = generateJWTToken(user.toJSON());

        const responseUser = { username: user.Username, email: user.Email, birthday: user.Birthday.toDateString, _id: user._id,};

        return res.json({ user: responseUser, message: 'Token generated. Use this JWT for authentication in future requests.', token });
      });
    })(req, res);
  });
}