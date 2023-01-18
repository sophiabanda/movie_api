const express = require('express'),
      //morgan middleware
      morgan = require('morgan'),
      //used to write server activity to a log file
      fs = require('fs'),
      path = require('path'),
      //middleware for request types
      bodyParser = require('body-parser'),
      uuid = require('uuid');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

app.use(bodyParser.json());

let users = [

    {
      firstName: 'Sophia',
      lastName: 'Banda',
      idNum: 123,
      email: 'sophia@fakemail.com',
      memberStatus: true
    }
  ]

let films = [

  {
    title: 'Goodfellas',
    genre: '',
    filmSummary: {},
    filmPosterIMG: '',
    director: {
      name: 'Martin Scorcese',
      birthDate: '',
      deathDate: ''
    },
    genre: {
      0: 'crime',
      1: 'biography',
      2: 'drama'
    }
  },

  {
    title: 'Jackie Brown',
    director: {
      name: 'Quentin Tarantino',
      birthDate: '',
      deathDate: ''
    },
    genre: {
      0: 'crime',
      1: 'thriller',
      2: 'drama'
    }

  },

  {
    title: 'Casino',
    director: 'Martin Scorcese',
    genre: {
      0: 'crime',
      1: 'drama'
    }
  },

  {
    title: 'Punch Drunk Love',
    director: 'Paul Thomas Anderson',
    genre: {
      0: 'comedy',
      1: 'drama',
      2: 'romance'
    }
  },

  {
    title: 'Magnolia',
    director: 'Paul Thomas Anderson',
    genre: {
      0: 'drama'
    }
  },

  {
    title: '2001: A Space Odyssey',
    director: 'Stanley Kubrick',
    genre: {
      0: 'adventure',
      1: 'sci-fi'
    }
  },

  {
    title: 'True Romance',
    director: 'Tony Scott',
    genre: {
      0: 'crime',
      1: 'drama',
      2: 'romance'
    }
  },

  {
    title: 'Mulholland Drived',
    director: 'Paul Thomas Anderson',
    genre: {
      0: 'mystery',
      1: 'drama',
      2: 'thriller'
    }
  },

  {
    title: 'Pet Semetary',
    director: 'Mary Lambert',
    genre: {
      0: 'fantasy',
      1: 'horror',
      2: 'thriller'
    }
  },

  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    genre: {
      0: 'drama'
    }
  },

  {
    title: 'Amélie',
    director: 'Jean-Pierre Jeunet',
    genre: {
      0: 'comedy',
      1: 'romance'
    }
  },

  {
    title: 'Coco',
    director: 'Lee Unkrich',
    genre: {
      0: 'animation',
      1: 'adventure',
      2: 'comedy'
    }
  },

  {
    title: 'Full Metal Jacket',
    director: 'Stanley Kubrick',
    genre: {
      0: 'drama',
      1: 'war'
    }
  },

  {
    title: 'The Lost Boys',
    director: 'Joel Schumacher',
    genre: {
      0: 'comedy',
      1: 'horror'
    }
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

//READ
app.get('/sophs_films', (req, res) => {
  res.status(200).json(films);
  // res.json(films);
});

//READ
app.get('/sophs_films/:title', (req, res) => {
  // const title = req.params.title;
  //Object destructuring:
  const { title } = req.params;
  const film = films.find(film => film.title === title);

  if (film) {
    res.status(200).json(film);
  } else {
    res.status(400).send('No such film.')
  }
});

//READ
app.get('/sophs_films/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = films.find(film => film.director.name === directorName).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('Director not found.')
  }
});

//READ
app.get('/sophs_films/genres/:genreType', (req, res) => {
  const { genreType } = req.params;
  const genre =  films.find(film => film.genre === genreType).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('Genre not found.')
  }
  });

//CREATE
app.post('/new_user', (req, res) => {
  const { newUser } =  req.body;

  if (newUser.firstName) {
    newUser.idNum = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('Please input a valid name.')
  }
  });

//DELETE

//returns "something broke!" if there is an error delivering on any of the above:
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(8080, () => {
  console.log('Your app is running on port 8080.');
});