const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');
require('dotenv').config() 

/**
 * Middleware for parsing JSON requests
 * @type {Object}
 */

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CORS middleware to allow requests from specified origins
 * @type {Function}
 */

const cors = require('cors');
let allowedOrigins = ['https://letflix-0d183cd4a94e.herokuapp.com', 'http://localhost:8080/', 'http://localhost:1234', 'https://letflixnow.netlify.app'];


/**
 * CORS middleware configuration
 * @param {string} origin - The origin of the request
 * @param {function} callback - The callback function
 */
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isnt found on the list of allowed origins
      let message = 'The CORS policy for this application doesnt allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));


let auth = require('./auth')(app);

/**
 * Importing auth.js file
 * @type {Function}
 */

const passport = require('passport');
require('./passport');

/**
 * Express middleware for logging all requests
 * @type {Function}
 */

app.use(morgan('common'));

const Movies = Models.Movie;
const Users = Models.User;

/**
 * MongoDB connection online
 * @type {Object}
 */

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

/**
 * Route to welcome message
 * @name WelcomeRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */

app.get('/', (req, res) => {
  res.send("Welcome to myFlix!");
});

/**
 * Route to add a new user
 * @name AddUserRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */

app.post('/users', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);

  try {
    const existingUser = await Users.findOne({ Username: req.body.Username });

    if (existingUser) {
      return res.status(400).send(req.body.Username + ' already exists');
    } else {
      const newUser = await Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      });

      const responseMessage = `User '${req.body.Username}' created. Use the '/login/' endpoint to obtain the JWT token.`;
      return res.status(201).json({ user: newUser, message: responseMessage });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error: ' + error);
  }
});

/**
 * Route to get all users
 * @name GetUsersRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
/**
 * Route to get a user by username
 * @name GetUserByUsernameRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
/**
 * Route to get a user's list of favorite movies
 * @name GetUserFavoritesRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */

app.get('/users/:Username/favorites', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await Users.findOne({ Username: req.params.Username }).populate('FavoriteMovies');
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Assuming 'FavoriteMovies' field stores references to movie documents
    res.json(user.FavoriteMovies);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});
/**
 * Route to add a movie to a user's list of favorite movies
 * @name AddMovieToFavoritesRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Route to get all movies
 * @name GetAllMoviesRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find() // Corrected to match the case in the database
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
/**
 * Route to get a single movie by title
 * @name GetMovieByTitleRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const title = req.params.Title; // Corrected to match the case in the URL
  try {
    const movie = await Movies.findOne(
      { Title: title }, // Adjusted to search by 'Title' field in the database
      'Description Genre Director ImagePath Featured' // Corrected field names
    );
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

/**
 * Route to get a genre by Description
 * @name GetGenreByNameRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.genreName })
    .then((movie) => {
      res.status(200).json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Route to Get Director by Name
 * @name GetDirectorByNameRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const name = req.params.name;
  try {
    const director = await Directors.findOne({ name: name }, 'bio birthYear deathYear');
    if (!director) {
      return res.status(404).send('Director not found');
    }
    res.json(director);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

/**
 * Route to update a user's information by username
 * @name UpdateUserInfoRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.put('/users/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userId = req.params.userId;
  const { Username, Password, Email, Birthday } = req.body;

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update user fields
    if (Username) {
      user.Username = Username;
    }
    if (Password) {
      user.Password = Password;
    }
    if (Email) {
      user.Email = Email;
    }
    if (Birthday) {
      user.Birthday = Birthday;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user: ' + error.message);
  }
});
/**
 * Route to remove a movie from a user's list of favorite movies
 * @name RemoveMovieFromFavoritesRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Movie removed successfully', updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error removing movie: ' + err.message });
  }
});
/**
 * Route to delete a user account by user ID
 * @name DeleteUserAccountRoute
 * @kind function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */

app.delete('/users/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    await Users.findByIdAndDelete(userId);
    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting user: ' + error.message);
  }
});


app.use('/documentation', express.static('public'));
// Creating error-handling that log all errors to terminal
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ups, something went wrong!');
});


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

