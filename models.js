const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Schema for storing movie data.
 * @constant {mongoose.Schema}
 */
let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
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

/**
 * Schema for storing user data.
 * @constant {mongoose.Schema}
 */
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * Hashes the password using bcrypt.
 * @param {string} password - The password to be hashed.
 * @returns {string} The hashed password.
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};
/**
 * Validates the provided password against the stored hashed password.
 * @param {string} password - The password to be validated.
 * @returns {boolean} Returns true if the password is valid, false otherwise.
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};
/**
 * Mongoose model for movies.
 * @constant {mongoose.Model}
 */
let Movie = mongoose.model('Movie', movieSchema);
/**
 * Mongoose model for users.
 * @constant {mongoose.Model}
 */
let User = mongoose.model('User', userSchema);

/**
 * Exports the Movie and User models.
 */
module.exports.Movie = Movie;
module.exports.User = User;


