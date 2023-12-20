const express = require('express');
const mongoose = require('mongoose');
const Models = require('./models.js');

const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Integrating Mongoose with a REST API
const Movies = Models.Movie;
const Users = Models.User;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/letflix_data', {
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

// Define your routes and other middleware below this point
app.get('/', (req, res) => {
    res.send("Welcome to myFlix!");
});


//The folloving code app.(post,get,put,delete) is for the CRUD operations

// CREATE (POST) add a new user
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => { res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});
// CREATE a movie to user's favorites
app.post('/users/:userId/favorites', async (req, res) => {
    const userId = req.params.userId;
    const { MovieId } = req.body;

    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Check if the movie is already in favorites
        if (user.favorites.includes(MovieId)) {
            return res.status(400).send('Movie already in favorites');
        }

        user.favorites.push(MovieId);
        const updatedUser = await user.save();

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding movie to favorites: ' + error.message);
    }
});
// READ (GET) all users
app.get('/users', async (req, res) => {
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
app.get('/users/:Username', async (req, res) => {
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
app.put('/users/:Username', async (req, res) => {
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
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
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
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movies.find();
        res.json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});
//READ (GET) a single movie by title
app.get('/movies/:Title', async (req, res) => {
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
app.get('/movies/genres/:genreName', async (req, res) => {
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
app.get('/directors/:Name', async (req, res) => {
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
app.put('/users/:userId', async (req, res) => {
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
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
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
app.delete('/users/:userId', async (req, res) => {
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
