
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

app.use(bodyParser.json());

//values of users authentication
let users = [
    {
        id: 1,
        name: 'Pablo',
        favoriteMovies: ["Titanic"],

    },
    {
        id: 2,
        name: 'Pablo',
        favoriteMovies: ["The Godfather"],
    }
];

//values of movies
let movies = [
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        genre: {
            name: 'Fantasy',
            description: 'In film and television, the fantasy genre encompasses fiction that involves supernatural elements and settings beyond the realm of reality. It often includes magical creatures, mystical forces, and worlds filled with wonder and adventure. Fantasy allows for the exploration of themes like heroism, morality, and the struggle between good and evil in a setting detached from mundane reality.'

        },
        director: {
            name: 'Chris Columbus',
            Bio: 'Chris Columbus, born on September 10, 1958, in Spangler, Pennsylvania, USA, is a renowned filmmaker and screenwriter. He directed the first two "Harry Potter" films and other family favorites like "Home Alone" and "Mrs. Doubtfire." His work is known for blending humor and whimsy with engaging storytelling.',
            Birth: 'September 10, 1958 in Spangler, Pennsylvania, USA'
        },
        'image URL': 'https://www.imdb.com/title/tt0241527/mediaviewer/rm2380562944/?ref_=tt_ov_i',
        feature: false
    },
    {
        title: 'The Godfather',
        genre: {
            name: 'Crime, Drama',
            description: 'A genre that often focuses on organized crime and moral dilemmas faced by characters involved in criminal underworlds.'
        },
        director: {
            name: 'Francis Ford Coppola',
            Bio: 'An American film director, producer, and screenwriter, known for his bold storytelling and iconic films in the crime genre.',
            Birth: 'April 7, 1939, in Detroit, Michigan, USA'
        },
        'image URL': 'https://www.imdb.com/title/tt0068646/mediaviewer/rm746868224/?ref_=tt_ov_i',
        feature: false
    },
    {
        title: 'Schindler\'s List',
        genre: {
            name: 'Biography, Drama, History',
            description: 'A poignant depiction of WWII, focusing on the human stories within historical events.'
        },
        director: {
            name: 'Steven Spielberg',
            Bio: 'A highly acclaimed director known for his impactful storytelling and versatility in various film genres.',
            Birth: 'December 18, 1946, in Cincinnati, Ohio, USA'
        },
        'image URL': 'https://www.imdb.com/title/tt0108052/mediaviewer/rm1756846080/?ref_=tt_ov_i',
        feature: false
    },
    {
        title: 'Forrest Gump',
        genre: {
            name: 'Drama, Romance',
            description: 'A genre that combines elements of human emotion and drama, often focusing on character development and relationships.'
        },
        director: {
            name: 'Robert Zemeckis',
            Bio: 'Known for his innovative storytelling and use of special effects in films that appeal to a broad audience.',
            Birth: 'May 14, 1952, in Chicago, Illinois, USA'
        },
        'image URL': 'https://www.imdb.com/title/tt0109830/mediaviewer/rm2775147008/?ref_=tt_ov_i',
        feature: false
    },
    {
        title: 'Titanic',
        genre: {
            name: 'Drama, Romance',
            description: 'An epic romance set against the ill-fated maiden voyage of the R.M.S. Titanic.'
        },
        director: {
            name: 'James Cameron',
            Bio: 'A filmmaker known for his ambitious and visually spectacular films, often pushing the boundaries of film technology.',
            Birth: 'August 16, 1954, in Kapuskasing, Ontario, Canada'
        },
        'image URL': 'https://www.imdb.com/title/tt0120338/mediaviewer/rm10105600/?ref_=tt_ov_i',
        feature: false
    },
    {
        title: 'La La Land',
        genre: {
            name: 'Comedy, Drama, Music',
            description: 'A modern musical set in Los Angeles, exploring the joys and pains of pursuing dreams.'
        },
        director: {
            name: 'Damien Chazelle',
            Bio: 'A contemporary director known for his work in revitalizing the musical genre with a modern twist.',
            Birth: 'January 19, 1985, in Providence, Rhode Island, USA'
        },
        'image URL': 'https://www.imdb.com/title/tt3783958/mediaviewer/rm1911193600/?ref_=tt_ov_i',
        feature: false
    },
    {
        title: 'Parasite',
        genre: {
            name: 'Comedy, Drama, Thriller',
            description: 'A South Korean black comedy thriller that explores class discrimination and wealth disparity.'
        },
        director: {
            name: 'Bong Joon Ho',
            Bio: 'A South Korean director known for his darkly humorous and socially conscious films.',
            Birth: 'September 14, 1969, in Daegu, South Korea'
        },
        'image URL': 'https://www.imdb.com/title/tt6751668/mediaviewer/rm3408113920/?ref_=tt_ov_i',
        feature: false
    },
];


//CREATE requests
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('users need names.')
    }
});

//UPDATE requests
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    }
    else {
        res.status(404).send('User not found.');
    }
});

//CREATE requests
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    }
    else {
        res.status(404).send('User not found.');
    }
});

//DELETE requests
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle)
        res.status(200).send(`${movieTitle} has been removed from user ${user.id}'s favorites.`);
    }
    else {
        res.status(404).send('User not found.');
    }
});
//DELETE requests
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id)
        res.status(200).send(`user ${id} has been removed.`);
    }
    else {
        res.status(404).send('User not found.');
    }
});





//READ requests
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});
//READ requests
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).send('Movie not found.');
    }

});
//READ requests
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.genre.name === genreName).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(404).send('Genre not found.');
    }

});
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.director.name === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(404).send('Director not found.');
    }

});


app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
