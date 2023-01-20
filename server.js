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
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Martin Scorcese',
        birthDate: '11/17/1942',
        directorBio: 'Martin Charles Scorsese is an American film director, producer, screenwriter and actor. Scorsese emerged as one of the major figures of the New Hollywood era.'
      },
      genre: [
        'crime',
        'biography',
        'drama'
      ]
    },

    {
      filmTitle: 'Jackie Brown',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Quentin Tarantino',
        birthDate: '03/27/1963',
        directorBio: 'Quentin Jerome Tarantino is an American film director, writer, producer, and actor. His films are characterized by frequent references to popular culture and film genres, non-linear storylines, dark humor, stylized violence, extended dialogue, pervasive use of profanity, cameos and ensemble casts.'
      },
      genre: [
        'crime',
        'thriller',
        'drama'
      ]
    },

    {
      filmTitle: 'Casino',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Martin Scorcese',
        birthDate: '11/17/1942',
        directorBio: 'Martin Charles Scorsese is an American film director, producer, screenwriter and actor. Scorsese emerged as one of the major figures of the New Hollywood era.'
      },
      genre: [
        'crime',
        'drama'
      ]
    },

    {
      filmTitle: 'Punch Drunk Love',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Paul Thomas Anderson',
        birthDate: '1970',
        directorBio: 'Paul Thomas Anderson, also known by his initials PTA, is an American filmmaker. His films have consistently garnered critical acclaim.'
      },
      genre: [
        'comedy',
        'drama',
        'romance'
      ]
    },

    {
      filmTitle: 'Magnolia',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Paul Thomas Anderson',
        birthDate: '1970',
        directorBio: 'Paul Thomas Anderson, also known by his initials PTA, is an American filmmaker. His films have consistently garnered critical acclaim.'
      },
      genre: [
        'drama'
      ]
    },

    {
      filmTitle: '2001: A Space Odyssey',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Stanley Kubrick',
        birthDate: '07/26/1928',
        directorBio: 'Stanley Kubrick was an American film director, producer, screenwriter, and photographer. Widely considered one of the greatest filmmakers of all time, his films, almost all of which are adaptations of novels or short stories, cover a wide range of genres and are noted for their innovative cinematography, dark humor, realistic attention to detail and extensive set designs.'
      },
      genre: [
        'adventure',
        'sci-fi'
      ]
    },

    {
      filmTitle: 'True Romance',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Tony Scott',
        birthDate: '06/21/1944',
        directorBio: 'Anthony David Leighton Scott was an English film director and producer. He was known for directing highly successful action and thriller films such as Top Gun, Beverly Hills Cop II, Days of Thunder, The Last Boy Scout, True Romance, Crimson Tide, Enemy of the State, Man on Fire, Déjà Vu, and Unstoppable.'
      },
      genre: [
        'crime',
        'drama',
        'romance'
      ]
    },

    {
      filmTitle: 'Mulholland Drive',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'David Lynch',
        birthDate: '01/20/1946',
        directorBio: `David Keith Lynch is an American filmmaker, visual artist and actor. A recipient of an Academy Honorary Award in 2019, Lynch has received three Academy Award nominations for Best Director, and the César Award for Best Foreign Film twice, as well as the Palme d'Or at the Cannes Film Festival and a Golden Lion award for lifetime achievement at the Venice Film Festival. In 2007, a panel of critics convened by The Guardian announced that "after all the discussion, no one could fault the conclusion that David Lynch is the most important film-maker of the current era", while AllMovie called him "the Renaissance man of modern American filmmaking". His work led to him being labeled "the first populist surrealist" by film critic Pauline Kael.`
      },
      genre: [
        'mystery',
        'drama',
        'thriller'
      ]
    },

    {
      filmTitle: 'Pet Semetary',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Mary Lambert',
        birthDate: '10/13/1951',
        directorBio: 'Mary Lambert Gary is an American director. She has directed music videos, television episodes and feature films, mainly in the horror genre.'
      },
      genre: [
        'fantasy',
        'horror',
        'thriller'
      ]
    },

    {
      filmTitle: 'The Shawshank Redemption',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Frank Darabont',
        birthDate: '01/28/1959',
        directorBio: 'Frank Árpád Darabont is an American film director, screenwriter and producer. He has been nominated for three Academy Awards and a Golden Globe Award. In his early career, he was primarily a screenwriter for such horror films as A Nightmare on Elm Street 3: Dream Warriors, The Blob and The Fly II.'
      },
      genre: [
        'drama'
      ]
    },

    {
      filmTitle: 'Amélie',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Jean-Pierre Jeunet',
        birthDate: '1953',
        directorBio: 'Jean-Pierre Jeunet is a French film director, producer and screenwriter. His films combine fantasy, realism and science fiction to create idealized realities or to give relevance to mundane situations.'
      },
      genre: [
        'romance',
        'comedy'
      ]
    },

    {
      filmTitle: 'Coco',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Lee Unkrich',
        birthDate: '1967',
        directorBio: 'Lee Edward Unkrich is an American film director, film editor, screenwriter, and animator. He was a longtime member of the creative team at Pixar, where he started in 1994 as a film editor. He later began directing, first as co-director of Toy Story 2.'
      },
      genre: [
        'animation',
        'adventure',
        'comedy'
      ]
    },

    {
      filmTitle: 'Full Metal Jacket',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Stanley Kubrick',
        birthDate: '07/26/1928',
        directorBio: 'Stanley Kubrick was an American film director, producer, screenwriter, and photographer. Widely considered one of the greatest filmmakers of all time, his films, almost all of which are adaptations of novels or short stories, cover a wide range of genres and are noted for their innovative cinematography, dark humor, realistic attention to detail and extensive set designs.'
      },
      genre: [
        'war',
        'drama'
      ]
    },

    {
      filmTitle: 'The Lost Boys',
      filmSummary: '',
      filmPosterIMG: '',
      director: {
        name: 'Joel Schumacher',
        birthDate: '08/29/1939',
        directorBio: 'Joel T. Schumacher was an American film director, producer and screenwriter. Raised in New York City by his mother, Schumacher graduated from Parsons School of Design and originally became a fashion designer. He first entered filmmaking as a production and costume designer before gaining writing credits on Car Wash, Sparkle, and The Wiz.'
      },
      genre: [
        'comedy',
        'horror'
      ]
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
//Get films by title
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
//Get info on a particular director
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
//Creates new user
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