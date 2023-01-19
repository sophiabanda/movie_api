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
      memberStatus: true,
      favoriteFilms: []
    }
  ]

let films = [
  {
    filmTitle: 'Goodfellas',
    genre: {
      type: {
        0: 'crime',
        1: 'biography',
        2: 'drama'
      },
      description: `A biography is simply the story of a real person's life. It could be about a person who is still alive, someone who lived centuries ago, someone who is globally famous, an unsung hero forgotten by history, or even a unique group of people.`
    },
    filmSummary: '',
    filmPosterIMG: '',
    director: {
      name: 'Martin Scorcese',
      birthDate: '11/17/1942',
      directorBio: 'Martin Charles Scorsese is an American film director, producer, screenwriter and actor. Scorsese emerged as one of the major figures of the New Hollywood era.'
    },
  },
  {
    filmTitle: 'Magnolia',
    genre: {
      type: {
        0: 'drama'
      },
      description: 'Drama Films are serious presentations or stories with settings or life situations that portray realistic characters in conflict with either themselves, others, or forces of nature. A dramatic film shows us human beings at their best, their worst, and everything in-between.'
    },
    filmSummary: '',
    filmPosterIMG: '',
    director: {
      name: 'Paul Thomas Anderson',
      birthDate: '1970',
      directorBio: 'Paul Thomas Anderson, also known by his initials PTA, is an American filmmaker. His films have consistently garnered critical acclaim.'
    },
  },
  {
    filmTitle: 'Amelie',
    genre: {
      type: {
        0: 'romance',
        1: 'comedy',
        2: 'rom-com'
      },
      description: 'Romantic comedy (also known as romcom or rom-com) is a subgenre of comedy and slice of life fiction, focusing on lighthearted, humorous plot lines centered on romantic ideas, such as how true love is able to surmount most obstacles.'
    },
    filmSummary: '',
    filmPosterIMG: '',
    director: {
      name: 'Jean-Pierre Jeunet',
      birthDate: '1953',
      directorBio: 'Jean-Pierre Jeunet is a French film director, producer and screenwriter. His films combine fantasy, realism and science fiction to create idealized realities or to give relevance to mundane situations.'
    },
  },
  {
    filmTitle: 'Coco',
    genre: {
      type: {
        0: 'animation',
        1: 'adventure',
        2: 'comedy'
    },
      description: 'Animation is a method by which still figures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film. Today, most animations are made with computer-generated imagery.'
    },
    filmSummary: '',
    filmPosterIMG: '',
    director: {
      name: 'Lee Unkrich',
      birthDate: '1967',
      directorBio: 'Lee Edward Unkrich is an American film director, film editor, screenwriter, and animator. He was a longtime member of the creative team at Pixar, where he started in 1994 as a film editor. He later began directing, first as co-director of Toy Story 2.'
    },
  },
  {
    filmTitle: 'Full Metal Jacket',
    genre: {
      type: {
        0: 'drama',
        1: 'war'
      },
      description: 'War film is a film genre concerned with warfare, typically about naval, air, or land battles, with combat scenes central to the drama.'
    },
    filmSummary: '',
    filmPosterIMG: '',
    director: {
      name: 'Stanley Kubrick',
      birthDate: '07/26/1928',
      directorBio: 'Stanley Kubrick was an American film director, producer, screenwriter, and photographer. Widely considered one of the greatest filmmakers of all time, his films, almost all of which are adaptations of novels or short stories, cover a wide range of genres and are noted for their innovative cinematography, dark humor, realistic attention to detail and extensive set designs.'
    }
  },
  {
    filmTitle: 'Pet Sematary',
    genre: {
      type: {
        0: 'fantasy',
        1: 'horror',
        2: 'thriller'
      },
      description: 'Horror is a film genre that seeks to elicit fear or disgust in its audience for entertainment purposes. Horror films often explore dark subject matter and may deal with transgressive topics or themes. Broad elements include monsters, apocalyptic events, and religious or folk beliefs.'
    },
    filmSummary: '',
    filmPosterIMG: '',
    director: {
      name: 'Mary Lambert',
      birthDate: '10/13/1951',
      directorBio: 'Mary Lambert Gary is an American director. She has directed music videos, television episodes and feature films, mainly in the horror genre.'
    },
  },
]

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
  let responseMessage = "Welcome to a list of my favorite films.";
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
});

//READ
app.get('/sophs_films/:title', (req, res) => {
  const { title } = req.params;
  const film = films.find(film => film.filmTitle.list === title);

  if (film) {
    res.status(200).json(film);
  } else {
    res.status(400).send('No such film.');
  }
});

//READ
app.get('/sophs_films/genre/:genreType', (req, res) => {
  const { genreType } = req.params;
  const genre = films.find(film => film.genre.type === genreType);

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('No such genre.');
  }
});

//READ
app.get('/sophs_films/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = films.find(film => film.director.name === directorName);

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('No such director.');
  }
});

//CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if(newUser.firstName || newUser.lastName) {
    newUser.idNum = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('Users need names.')
  };
});

//UPDATE
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