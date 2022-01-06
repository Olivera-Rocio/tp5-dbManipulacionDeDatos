const db = require('../database/models');
const moment = require('moment');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        return res.render('moviesAdd') 
    },
    create: function (req, res) {
        const {title, awards, rating, release_date, length} = req.body
        db.Movie.create({
            title: title.trim(),
            rating,
            awards,
            release_date,
            length
        })
        .then(movie =>{
            return res.redirect('/movies')
        })
        .catch(error => console.log(error))
    },
    edit: function(req, res) {
        db.Movie.findByPk(req.params.id)
        .then(Movie =>{
            return res.render('moviesEdit', {
                Movie,
                release_date : moment(Movie.release_date).add(1, 'd').format('YYYY-MM-DD')
            })
        })
        .catch(error => console.log(error))
    },
    update: function (req,res) {
        const {title, awards, rating, release_date, length} = req.body;

        db.Movie.update(
        {
            title: title.trim(),
            rating,
            awards,
            release_date,
            length
        },
        {
            where : {
                id: req.params.id
            }
        }
        )
        .then( () =>{
            return res.redirect('/movies/detail/' + req.params.id)
        })
        .catch(error =>console.log(error))
    },
    delete: function (req, res) {        
            db.Movie.findByPk(req.params.id)
            .then(Movie =>{
                return res.render('moviesDelete', {
                    Movie,
                })
            })
            .catch(error => console.log(error))
        
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where: {
                id: req.params.id
            }
        })
        .then( () =>{
          return  res.redirect('/movies')
        })
        .catch(error =>console.log(error))
}
}

module.exports = moviesController;