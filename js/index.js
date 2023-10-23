// Require Express in your "index.js" file:
const express = require('express');
const app = express();
const morgan = require('morgan');
const port = 8080;

// Create an Express GET route at /movies
app.get('/movies', (req, res) => {
    const top10Movies = [
        {
            title: 'Harry Potter and the Sorcerer\'s Stone',
            author: 'J.K. Rowling'
        },
        {
            title: 'Lord of the Rings',
            author: 'J.R.R. Tolkien'
        },
        {
            title: 'Twilight',
            author: 'Stephanie Meyer'
        },
        {
            title: 'The Shawshank Redemption',
            author: 'Frank Darabont'
        },
        {
            title: 'The Godfather',
            author: 'Francis Ford Coppola'
        },
        {
            title: 'Pulp Fiction',
            author: 'Quentin Tarantino'
        },
        {
            title: 'The Dark Knight',
            author: 'Christopher Nolan'
        },
        {
            title: 'Schindler s List',
            author: 'Steven Spielberg'
        },
        {
            title: 'Forrest Gump',
            author: 'Robert Zemeckis'
        },
        {
            title: 'The Matrix',
            author: 'The Wachowskis brothers'
        }
    ];
    res.json(top10Movies);
});

app.use(express.static('public'));

app.use(morgan('combined'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!!');
});




// Start the Express server (listening incoming requests)
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});