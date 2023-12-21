# LetFlix - Your Movie Database

LetFlix is a web application that serves as a movie database, allowing users to manage their favorite movies and explore various movie details.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)


## About

LetFlix is a Node.js-based application that leverages Express.js and MongoDB to create a platform where users can register, manage their profiles, and add favorite movies to their collection. The application provides a range of endpoints to handle CRUD operations for users and movies.

## Features

- User authentication and registration.
- CRUD operations for users and movies.
- Adding and removing movies from a user's favorites.
- Retrieving detailed information about movies, genres, and directors.

## Installation

1. Clone the repository.
   ```bash
   git clone https://github.com/your-username/your-repo.git
Install dependencies.
bash
Copy code
npm install
Set up the necessary environment variables.
## Usage
To start the server, use the following command:

```bash
Copy code npm start
```

## Endpoints
Users
### GET /users - Retrieve all users.
### POST /users - Create a new user.
### GET /users/:Username - Retrieve a user by username.
### PUT /users/:Username - Update a user's information.
### DELETE /users/:userId - Delete a user by ID.
Movies
### GET /movies - Retrieve all movies.
### GET /movies/:Title - Retrieve a movie by title.
### GET /movies/genres/:genreName - Retrieve a genre by name.
Favorites
### POST /users/:userId/favorites - Add a movie to a user's favorites.
### DELETE /users/:Username/movies/:MovieID - Remove a movie from a user's favorites.
Directors
### GET /directors/:Name - Retrieve data about a director by name.
## Technologies Used
Node.js
Express.js
MongoDB
Mongoose
## Contributing
Contributions are welcome! Feel free to fork the project, create a branch, and submit pull requests.
