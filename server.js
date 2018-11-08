const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');
const googleBooksApiRequest = require('./googlebooksapi');
var {Collection} = require('./models/collection');
var {Book} = require('./models/book');

const port = process.env.PORT || 3000;

var app = express();

app.use(express.static(__dirname + '/static'));
app.use(express.json());
app.use(bodyParser.json());
// app.use(express.urlencoded({extended: true}));

var books = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/home.html'), {
        books: books
    })
})

app.get('/collections', (req, res)=>{
    Collection.find().then((collections)=>{
        res.send(collections);
    }, (e)=>{
        res.status(400).send(err);
    })
})

//google books search
app.get('/searchBooks', (req, res)=>{
    var titleSearch = req.query.title;
    googleBooksApiRequest.googleBooksApiRequest(titleSearch).then((googleApiResponse)=>{
        books = JSON.parse(googleApiResponse).items;
        res.send(books);
    })
})

//REST routes

//CREATE collection
app.post('/collections/create', (req, res)=>{
    var requestBody = req.body;
    console.log("Creating new collection:", requestBody);
    var collection = new Collection({
        title: req.body.newCollectionTitle
    });
    collection.save().then((success)=>{
        console.log(success);
    }, (err)=>{
        res.status(400).send(err);
        console.log("Error:", err)
    })
})

// READ ONE collection

// READ ALL collections
//app.get('/collections/readAll', (req, res)=>{
//    
//})

// UPDATE collection
app.post('/collections/update/', (req, res)=>{
    var requestBody = req.body;
    console.log("Collection update: " + JSON.stringify(requestBody, undefined, 2));
    res.status(200).send("Successfully updated collection.");
})


//DELETE collection

//BOOKS CRUD

//CREATE book
app.post('/books/create', (req, res)=>{
    var book = new Book({
        title: req.body.title,
        authors: req.body.authors,
        isbn13: req.body.isbn13,
        googleBooksId: req.body.googleBooksId
    });
    book.save().then((success)=>{
        console.log("Book created:", success);
        res.status(200).send(success);
    }, (err)=>{
        res.status(400).send(err);
    })
})

//READ ONE book

//READ ALL books

//UPDATE book

//DELETE book


app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});