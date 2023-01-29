const mongoose = require('mongoose');

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
        Favorites: [{type: mongoose.Types.ObjectId, ref: 'Film'}]
    }
);

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
)

let Film = mongoose.model('Film', filmSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Film = Film;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;

