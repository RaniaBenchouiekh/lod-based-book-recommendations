var express = require('express');
var router = express.Router();
var BooksFetcherRating = require('../modules/BooksFetcherRating.js')
var BooksFetcher = require('../modules/BooksFetcher.js')

router.get('/genres', async function(req, res, next) {
    var genre = req.param('genre');
    var page = req.param('page');
    let books = await BooksFetcherRating.fetchBooksByGenre(genre, page)
    res.json(books)
});

router.get('/authors', async function(req, res, next) {
    var authors = req.param('author');
    let books = await BooksFetcher.fetchBooksByAuthor(authors)
   // console.log(books)
    res.json(books) 
});

module.exports = router;