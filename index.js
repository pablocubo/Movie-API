const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');

// Middleware for parsing JSON requests
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const cors = require('cors');
let allowedOrigins = ['http:localhost:8080', 'http://testsite.com'];

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
// importing auth.js file
let auth = require('./auth')(app);

// Import passport and passport.js
const passport = require('passport');
require('./passport');

// log all requests
app.use(morgan('common'));

// Integrating Mongoose with a REST API
const Movies = Models.Movie;
const Users = Models.User;

// MongoDB connection locally
/* mongoose.connect('mongodb://127.0.0.1:27017/letflix_data', {
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
}); */

//MongoDB connection online
mongoose.connect(process.env.CONNECTION_URI);

// Define your routes and other middleware below this point
app.get('/', (req, res) => {
  res.send("Welcome to myFlix!");
});
//The folloving code app.(post,get,put,delete) is for the CRUD operations


// CREATE (POST) add a new user
app.post('/users', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
  // Check the validation objects for errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Hash the password
  let hashedPassword = Users.hashPassword(req.body.Password);

  try {
    const existingUser = await Users.findOne({ Username: req.body.Username });
<<<<<<< Updated upstream

=======
    let responseUser = { username: newUser.Username, email: newUser.Email, birthday: newUser.Birthday.toDateString };
>>>>>>> Stashed changes
    if (existingUser) {
      return res.status(400).send(req.body.Username + ' already exists');
    } else {
      const newUser = await Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      });

<<<<<<< Updated upstream
      const responseMessage = `User '${req.body.Username}' created. Use the '/login/' endpoint to obtain the JWT token.`;
      return res.status(201).json({ user: newUser, message: responseMessage });
    }
=======
      // Remove the Password field before sending the response


      const responseMessage = `User '${req.body.Username}' created. Use the '/login/' endpoint to obtain the JWT token.`;
      return res.status(201).json({ message: responseMessage });
    }

>>>>>>> Stashed changes
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error: ' + error);
  }
});

// READ (GET) all users
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
// READ (GET) a user by username
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
// UPDATE (PUT) a user's info, by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  //Condition to check added here to make sure that the user is updating their own information
  if (req.params.Username !== req.body.Username) {
    return res.status(400).send('Username does not match');
  }
  //Condition ends here
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })

});
// Add a movie to a user's list of favorites
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
//READ (GET) all movies
<<<<<<< Updated upstream
app.get('/movies', async (req, res) => {
  await Movies.find() // Corrected to match the case in the database
    .then((movies) => {
      res.status(201).json(movies);
=======
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find() // Corrected to match the case in the database
    .then((movies) => {
      res.status(200).json(movies);
>>>>>>> Stashed changes
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
//READ (GET) a single movie by title
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
// READ (GET) returns the Genre by name
/**
 * Gets a genre
 * @name getGenre
 * @param {string} genreName genreName
 * @kind function
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
//READ (GET) data about a director by name
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
//UPDATE (PUT) a user's info, by username
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
// DELETE a movie from user's favorites
/**
 * Removes a favorite movie for a user
 * @name removeFavoriteMovie
 * @param {string} Username username
 * @param {string} MovieID movieid
 * @kind function
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
// DELETE user account
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


// Error-handling
app.use('/documentation', express.static('public'));
// Creating error-handling that log all errors to terminal
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ups, something went wrong!');
});


//listen, 8080 port
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

