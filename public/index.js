const express = require('express');
const app = express();
const morgan = require('morgan');

let topFilms = [

  {
    title: 'Goodfellas',
    director: 'Martin Scorcese'
  },

  {
    title: 'Jackie Brown',
    director: 'Quentin Tarantino'
  },

  {
    title: 'Casino',
    director: 'Martin Scorcese'
  },

  {
    title: 'Punch Drunk Love',
    director: 'Paul Thomas Anderson'
  },

  {
    title: 'Magnolia',
    director: 'Paul Thomas Anderson'
  },

  {
    title: '2001: A Space Odyssey',
    director: 'Stanley Kubrick'
  },

  {
    title: 'True Romance',
    director: 'Tony Scott'
  },

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

app.get('/', (req, res) => {
  let responseMessage = "Welcome to a list of my favorite films." + " ";
  responseMessage += '<small>Requested at:' + req.requestTimeStamp + '</small>';
  res.send(responseMessage);
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

app.use(express.static('public'));

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/sophs_films', (req, res) => {
  res.json(topFilms);
});

app.listen(8080, () => {
  console.log('Your app is running on port 8080.');
});