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
app.post('/users', async (req, res) => {
    const { Username, Password, Email, Birthday } = req.body;

    try {
        const existingUser = await Users.findOne({ Username });

        if (existingUser) {
            return res.status(400).send(Username + ' already exists');
        }

        const newUser = await Users.create({
            username,
            password,
            email,
            Birthday
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
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
