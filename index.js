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
mongoose.connect('mongodb://localhost:27017/letflix_data', { useNewUrlParser: true, useUnifiedTopology: true });


// Define your routes and other middleware below this point

app.get('/', (req, res) => {
    res.send("Welcome to myFlix!");
});



//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
//The folloving code app.(post,get,put,delete) is for the CRUD operations
// CREATE requests, ADD NEW USERS
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
