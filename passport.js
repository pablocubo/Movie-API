const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy, //first passport strategy defines your basic HTTP authentication for login requests
    Models = require('./models.js'),
    passportJWT = require('passport-jwt'); //second passport strategy authenticates users based on the JWT submitted alongside their request

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username',
            passwordField: 'Password',
        },
        async (username, password, callback) => {
            console.log('${username} ${password}');

            await Users.findOne({ Username: username })
                .then((user) => {
                    if (!user) {
                        console.log('Incorrect username');

                        return callback(null, false, { message: 'Incorrect username or password.' });
                    }
                    console.log('Finished');
                    return callback(null, user);
                })
                .catch((error) => {
                    if (error) {
                        console.log(error);
                        return callback(error);
                    }
                })
        }
    )
);

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));