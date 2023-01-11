const express = require('express');
const app = express();

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

app.get('/', (req, res) => {
  res.send('Welcome to a list of my favorite films.');
});

app.use(express.static('public'));

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/sophs_films', (req, res) => {
  res.json(sophsFilms);
});

app.listen(8080, () => {
  console.log('Your app is running on port 8080.');
});