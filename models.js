const mongoose = require('mongoose'),
      bcrypt = require('bcrypt');

let filmSchema = mongoose.Schema(
    {
        Title: {type: String, required: true},
        Summary: {type: String, required: true},
        Genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true }],
        Director: { type: mongoose.Types.ObjectId, ref: 'Director', required: true},
        filmPosterImg: String,
        Featured: Boolean
    }
);

let userSchema = mongoose.Schema(
    {
        Name: {type: String, required: true},
        Email: {type: String, required: true},
        Password: {type: String, required: true},
        Birthday: Date,
        Favorites: {
            Film: { type: mongoose.Types.ObjectId, ref: 'Film'},
            Title: { type: String, ref: 'Film' }
        }
    }
);

  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };

  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
//DO NOT USE ARROW FUNCTIONS WHEN DEFINING INSTANCE METHODS!! (.this)

let genreSchema = mongoose.Schema(
    {
        Type: { type: String, required: true},
        Description: String
    }
);

let directorSchema = mongoose.Schema(
    {
        Name: {type: String, required: true},
        Bio: {type: String, required: true},
        BirthDate: Date
    }
);

let Film = mongoose.model('Film', filmSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Film = Film;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;

