const express = require('express'),
      //morgan middleware
      morgan = require('morgan'),
      //used to write server activity to a log file
      fs = require('fs'),
      path = require('path'),
      //middleware for request types
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      Models = require('./models');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');


const Films = Models.Film;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/sophiaFilms', { useNewUrlParser: true, useUnifiedTopology: true })

app.use(bodyParser.json());

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
app.use(morgan('common'));
app.use(morgan('combined', {stream: accessLogStream}));


app.post('/users', (req, res) => {
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
            Password: req.body.Password
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


// app.get('/', (req, res) => {
//   let responseMessage = "Welcome to a list of my favorite films.";
//   responseMessage += '<small>Requested at:' + req.requestTimeStamp + '</small>';
//   res.send(responseMessage);
// });

//
app.get('/users', (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/users/:Name', (req, res) => {
  Users.findOne({ Name: req.params.Name })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    res.status(500).send('Error: ' + err);
  });
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

//sets directory from which to grab static files:
app.use(express.static('public'));

//get retrieves all that is requested below:
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});

//READ
app.get('/sophs_films', (req, res) => {
  res.status(200).json(films);
});

//READ
// Get films by title
app.get('/sophs_films/:title', (req, res) => {
  const { title } = req.params;
  const film = films.find(film => film.Title.list === title);

  if (film) {
    res.status(200).json(film);
  } else {
    res.status(400).send('No such film.');
  }
});

//READ
//Return movie with specified genres
app.get('/sophs_films/genre/:genreType', (req, res) => {
  const { genreType } = req.params;
  const genre = films.filter(film => film.genre.includes(genreType));

  if (genre) {
  res.status(200).json(genre);
  } else {
  res.status(400).send('No such genre.');
  }
  });

//READ
app.get('/sophs_films/genre/:genreType', (req, res) => {
  const { genreType } = req.params;
  const genre = films.filter(film => film.genre.name === genreType);

  if (genre) {
    res.status(200).json(genre)
  } else {
    res.status(400).send('No such genre');
  }
});


//READ
//Get info on a particular director
app.get('/sophs_films/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = films.filter(film => film.director.name === directorName);

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('No such director.');
  }
});

//CREATE
// Creates new user
// app.post('/users', (req, res) => {
//   const newUser = req.body;

//   if(newUser.firstName || newUser.lastName) {
//     newUser.idNum = uuid.v4();
//     users.push(newUser);
//     res.status(201).json(newUser)
//   } else {
//     res.status(400).send('Users need names.')
//   };
// });

//UPDATE
//Updates user name
app.put('/users/:idNum', (req, res) => {
  const {idNum } = req.params;
  const udpatedUser = req.body;

  let user = users.find(user => user.idNum == idNum);

  if(user) {
    user.firstName = udpatedUser.firstName;
    res.status(200).json(user)
  } else {
    res.status(400).send('User not found.');
  }
});

//UPDATE
//Adds a fav to films
app.put('/users/:idNum/:filmTitle', (req, res) => {
  const { idNum, filmTitle } = req.params;

  let user = users.find(user => user.idNum == idNum);

  if(user) {
    user.favoriteFilms.push(filmTitle);
    res.status(200).send(`${filmTitle} has been added to user ${idNum}'s favorite films.`)
  } else {
    res.status(400).send('User not found.');
  }
});

//DELETE
//Deletes user fav film
app.delete('/users/:idNum/:filmTitle', (req, res) => {
  const { idNum, filmTitle } = req.params;

  let user = users.find(user => user.idNum == idNum);

  if(user) {
    user.favoriteFilms = user.favoriteFilms.filter(title => title !== filmTitle);
    res.status(200).send(`${filmTitle} has been removed from user ${idNum}'s favorite films.`)
  } else {
    res.status(400).send('User not found.');
  }
});

//DELETE
//Deletes user
app.delete('/users/:idNum', (req, res) => {
  const { idNum } = req.params;

  let user = users.find(user => user.idNum == idNum);

  if(user) {
    users = users.filter(user => user.idNum == idNum);
    res.status(200).send(`User ${idNum} has been deleted.`)
  } else {
    res.status(400).send('User not found.');
  }
});

//returns "something broke!" if there is an error delivering on any of the above:
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(8080, () => {
  console.log('Your app is running on port 8080.');
});