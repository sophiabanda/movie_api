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
mongoose.connect('mongodb://localhost:27017/sophiaFilms', { useNewUrlParser: true, useUnifiedTopology: true })

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

//---------------------------------------------------CORS ALLOWANCES WITH SPECIFICATIONS
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

//---------------------------------------------------SITE
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


//---------------------------------------------------FILMS
//Get list of films
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

//Get Film by Title
app.get('/films/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Films.findOne( {Title: req.params.Title} )
  .then((film) => {
    res.status(201).json(film)
  })
  .catch((err) => {
    res.status(500).send('Error ' + err);
  });
});

//Get film by Genre type
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

//Return all films by a particlar Director
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
      .catch((err) => {
      //Second error catch for the films search
       res.status(500).send(`Error: ${err}`);
    });
  });

//---------------------------------------------------USERS
// Return all Users
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

//Create new User "Register"
app.post('/users', [
 check('Name', 'Name is a required field and must be at least 5 letters').isLength({min:5}),
 check('Name', 'Name contains non-alphanumeric characters - not allowed').isAlphanumeric(),
 check('Password', 'Password is required').notEmpty(),
 check('Password', 'Must be at least 8 alphanumeric characters').isLength({min:8}),
 check('Email', 'Email does not appear to be valid').isEmail().normalizeEmail().notEmpty()
], (req, res) => {

  let errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

   let hashedPassword = Users.hashedPassword(req.body.Password);
   Users.findOne({ Name: req.body.Name })
   //Checks to see if user already exists
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

//Update User Info
app.put('/users/:Name', [
  check('Name', 'Name is a required field and must be at least 5 letters').isLength({min:5}),
  check('Name', 'Name contains non-alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').notEmpty(),
  check('Password', 'Must be at least 8 alphanumeric characters').isLength({min:8}),
  check('Email', 'Email does not appear to be valid').isEmail().normalizeEmail().notEmpty()
 ], (req, res) => {

  let errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  Users.findOneAndUpdate( {Name: req.params.Name},
  { $set:
    {
      Name: req.body.Name,
      Email: req.body.Email,
      Password: req.body.Password,
      Birthday: req.body.Birthday
    }
  },
  //ensures the new doc is returned:
  { new: true },
  (err, udpatedUser) => {
    if(err) {
      console.log(err);
      res.status(500).send(`Error ${err}`);
    } else {
      res.json(udpatedUser);
    }
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
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
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

const port = process.env.PORT || 8080
app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`);
});