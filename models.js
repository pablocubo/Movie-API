//typically placed at the beginning of a Node.js file to import the 'mongoose' library
const mongoose = require('mongoose');


//define the structure of MOVIE documents in the collection
let movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birth: String,
        Death: String
    },
    Actors: [String],
    Bio: String,
    ImagePath: String,
    Featured: Boolean
});

//define the structure of GENRE documents in the collection
/* let genreSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    }
}); */

//define the structure of USER documents in the collection
let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

//Models in Mongoose act as constructors for MongoDB documents. They allow you to create, read, update, and delete documents
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
/* let Genre = mongoose.model('Genre', genreSchema); */

//export the models so they can be imported into other files in the project (like index.js)
module.exports.Movie = Movie;
module.exports.User = User;
/* module.exports.Genre = Genre; */ // Export the Genres model

