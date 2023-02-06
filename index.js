const express = require('express'),
      //framework providing a broad set of features for the building of web and mobile apps
      morgan = require('morgan'),
      //middleware for loggin http requests
      bodyParser = require('body-parser'),
      //middleware for allowing access to req.body from within routes to use that data. used when more than just the URL is hit (body data being sent)
      Models = require('./models'),
      fs = require('fs'),
      //used to write server activity to a log file
      path = require('path'),
      //helps to route traffic logs
      passport = require('passport'),
      cors = require('cors');
      require('./passport')

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});
const { check, validationResult } = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
//The default setting of the above allows requests from all origins

let auth = require('./auth')(app);

const mongoose = require('mongoose');
const { format } = require('path');
// mongoose.connect('mongodb://localhost:27017/sophiaFilms', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Films = Models.Film;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

app.use(morgan('common'));
app.use(morgan('combined', {stream: accessLogStream}));

const myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

const requestTimeStamp = (req, res, next) => {
  req.requestTimeStamp = Date.now();
  next();
}

app.use(myLogger);
app.use(requestTimeStamp);

//---------------------------------------------------------------------------------------CORS ALLOWANCES
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1) {
//       let message = `The CORS policy for this application does not allow access from the origin ${origin}`;
//       return callback(new Error(message), false);
//     }
//     return callback(null, true)
//   }
// }))

//---------------------------------------------------SITE---------------------------------------------------SITE---------------------------------------------------SITE
//Homepage Welcome
app.get('/', (req, res) => {
  res.status(201).send('Welcome to my film database!')
})

//sets directory from which to grab static files:
app.use(express.static('public'));

//get retrieves all that is requested below:
app.get('/documentation', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});


//---------------------------------------------------FILMS---------------------------------------------------FILMS---------------------------------------------------FILMS
//GET list of films
app.get('/films', passport.authenticate('jwt', {session: false}), (req, res) => {
  Films.find()
  .then((films) => {
    res.status(201).json(films);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error: ' + err);
  });
});

//GET Film by Title
app.get('/films/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Films.findOne( {Title: req.params.Title} )
  .then((film) => {
    res.status(201).json(film)
  })
  .catch((err) => {
    res.status(500).send('Error ' + err);
  });
});

//GET film by Genre type
app.get('/films/genre/:genreType', passport.authenticate('jwt', {session: false}), (req, res) => {
  //First retrieve the Genre doc with the matching Type:
  Genres.findOne({ Type: req.params.genreType })
  //Then retrrieve Films with matching genre id:
   .then((genre) => {
    Films.find({ Genres: genre._id })
    .then((films) => {
      res.status(200).json(films)
    })
    .catch((err) => {
      res.status(500).send('Error ' + err);
     });
    })
  });

//GET/ Return all films by a particlar Director
app.get('/films/director/:directorName', passport.authenticate('jwt', {session: false}), (req, res) => {
  // First retrieve the Director doc with the matching name:
  Directors.findOne({ Name: req.params.directorName })
    .then((director) => {
      // Then retrieve all Films with matching director id:
      Films.find({ Director: director._id })
        .then((films) => {
          res.status(200).json(films);
        })
        .catch((err) => {
          res.status(500).send(`Error: ${err}`);
        });
    })
    ////Second error catch for the films search
    .catch((err) => {
      res.status(500).send(`Error: ${err}`);
    });
});

//---------------------------------------------------USERS---------------------------------------------------USERS---------------------------------------------------USERS
//GET/ Return all Users
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error: ' + err);
  });
});

//CREATE/Post new User "Register"
app.post('/users',
  [check('Name', 'Name is a required field and must be at least 5 alphanumeric characters')
    .isLength( {min: 5} )
    .isAlphanumeric('en-US', {ignore: ' '}) //added parameter that makes it ok to have a space for First Last instead of FirstLast
    .bail(),
  check('Password', 'Password is required and must be at least 8 characters')
    .notEmpty()
    .bail(),
  check('Email', 'Please provide a valid email address')
    .normalizeEmail()
    .isEmail()
  ], (req, res) => {

  let errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);

  Users.findOne({ Name: req.body.Name })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Name + ' already exists');
      } else {
        Users
          .create({
            Name: req.body.Name,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
            Password: hashedPassword
          })
          .then((user) =>{res.status(201).json(user) })
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

  //UPDATE User Info ------ Test all of these variables again to make sure you have correct docs
  app.put('/users/:Name', passport.authenticate('jwt', {session: false}), //Is it safe to have access to change all those fields with just url and token access?
  [check('Name', 'Name must be at least 5 alphanumeric characters')
    .optional( {nullable: true} ) //optional with 'nullable: true' parameter ensures that the sequence won't fail if the check is missing
    .isLength( {min: 5} )
    .isAlphanumeric('en-US', {ignore: ' '}) //added 'ignore' parameter makes it ok to have a space for First Last instead of FirstLast
    .bail(),
  check('Password', 'Password is required and must be at least 8 characters') //I don't believe you should be able to update a password here. This should be a different function for change or rest pass.
    .notEmpty()
    .bail(),
  check('Email', 'Please provide a valid email address')
    .optional( {nullable: true} )
    .normalizeEmail()
    .isEmail(),
  check('Birthday')
    .optional( {nullable: true} )
    .isDate(format)
  ], (req, res) => {

    let errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate( {Name: req.params.Name}, { $set:
      {
        Name: req.body.Name,
        Email: req.body.Email,
        Password: hashedPassword,
        Birthday: req.body.Birthday
      }
    },

    { new: true }, //Ensures the new doc is returned
    (err, udpatedUser) => {
      if(err) {
        console.log(err);
        res.status(500).send('Error ' + err);
      } else {
        res.json(udpatedUser);
      }
    });
  });

// Find User by Name
app.get('/users/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOne({ Name: req.params.Name })
  .then((user) => {
    if(user) {
      res.json(user);
    } else {
      res.status(404).send('No such user.')
    }
  })
  .catch((err) => {
    res.status(500).send('Error: ' + err);
  });
});

//Find User by iD
app.get('/users/id/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOne( { _id: req.params.id} )
  .then((user) => {
    if(user) {
      res.json(user);
    } else {
      res.status(404).send('No such user.')
    }
  })
  .catch((err) => {
    res.status(500).send('Error: ' + err);
  });
});

//Add a Favorite Film to User's Favorites by name
app.post('/users/:Username/films/:filmTitle', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate( { Name: req.params.Username },
    { $addToSet: { Favorites: req.params.filmTitle } },
    { new: true },
    (err, udpatedUser) => {
      if(err) {
        console.log(err);
        res.status(500).send('Error ' + err)
      } else {
        console.log('Added only if film does not already exist.')
        res.status(200).json(udpatedUser);
      }
    }
    );
});

//Add film to user favorites by film iD
app.post('/users/:Username/films/:filmId', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate( { Name: req.params.Username },
    { $addToSet: { Favorites: req.params.filmId } },
    { new: true },
    (err, udpatedUser) => {
      if(err) {
        console.log(err);
        res.status(500).send('Error ' + err)
      } else {
        console.log('Added only if film does not already exist.')
        res.status(200).json(udpatedUser);
      }
    }
    );
});

//Delete a Favorite Film from User's Favorites by name
app.delete('/users/:Username/films/:filmTitle', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate( { Name: req.params.Username },
    { $pull: { Favorites: req.params.filmTitle } },
    { new: true },
    (err, udpatedUser) => {
      if(err) {
        console.log(err);
        res.status(500).send('Error ' + err)
      } else {
        res.json(udpatedUser);
      }
    }
    );
});

//Delete Favorite film from user favorites by film iD
app.delete('/users/:Username/films/:filmId', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate( { Name: req.params.Username },
    { $pull: { Favorites: req.params.filmId } },
    { new: true },
    (err, udpatedUser) => {
      if(err) {
        console.log(err);
        res.status(500).send('Error ' + err)
      } else {
        console.log('Added if new film.')
        res.json(udpatedUser);
      }
    }
    );
});


//Delete a User by Username "De-Register"
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}),(req, res) => {
  Users.findOneAndRemove({ Name: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Delete User by User iD
app.delete('/users/id/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove( {id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//returns "something broke!" if there is an error delivering on any of the above:
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Your app is listening on port ${port}.`);
});