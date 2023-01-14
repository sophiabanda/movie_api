const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs'),
      path = require('path');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

let topFilms = [

  {
    title: 'Goodfellas',
    genre: '',
    filmSummary: {},
    filmPosterIMG: <img>link to image</img>,
    director: {
      name: 'Martin Scorcese',
      birthYear: 0,
      deathYear: 0,
      dirBio: ''
    }
  },

  {
    title: 'Jackie Brown',
    director: 'Quentin Tarantino',
    genre: ''
  },

  {
    title: 'Casino',
    director: 'Martin Scorcese',
    genre: ''
  },

  {
    title: 'Punch Drunk Love',
    director: 'Paul Thomas Anderson',
    genre: ''
  },

  {
    title: 'Magnolia',
    director: 'Paul Thomas Anderson',
    genre: ''
  },

  {
    title: '2001: A Space Odyssey',
    director: 'Stanley Kubrick',
    genre: ''
  },

  {
    title: 'True Romance',
    director: 'Tony Scott',
    genre: ''
  },

  {
    title: 'Mulholland Drived',
    director: 'Paul Thomas Anderson',
    genre: ''
  },

  {
    title: 'Pet Semetary',
    director: 'Mary Lambert',
    genre: ''
  },

  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    genre: ''
  },

  {
    title: 'Amélie',
    director: 'Jean-Pierre Jeunet',
    genre: ''
  },

  {
    title: 'Coco',
    director: 'Lee Unkrich',
    genre: ''
  },

  {
    title: 'Full Metal Jacket',
    director: 'Stanley Kubrick',
    genre: ''
  },

  {
    title: 'The Lost Boys',
    director: 'Joel Schumacher',
    genre: ''
  }

];

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


app.get('/', (req, res) => {
  let responseMessage = "Welcome to a list of my favorite films." + " ";
  responseMessage += '<small>Requested at:' + req.requestTimeStamp + '</small>';
  res.send(responseMessage);
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

app.get('/sophs_films', (req, res) => {
  res.json(topFilms);
});
//returns "something broke!" if there is an error delivering on any of the above:
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(8080, () => {
  console.log('Your app is running on port 8080.');
});