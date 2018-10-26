const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');
const googleBooksApiRequest = require('./googlebooksapi');
const {Collection} = require('./models/collection')

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

//google books search
app.get('/searchBooks', (req, res)=>{
    var titleSearch = req.query.title;
    googleBooksApiRequest.googleBooksApiRequest(titleSearch).then((googleApiResponse)=>{
        books = JSON.parse(googleApiResponse).items;
        res.send(books);
    })
})

//REST routes

//create collection
app.post('/collections/create', (req, res)=>{
    var requestBody = req.body;
    console.log("Look a POST:", requestBody);
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

//collections -- read one

//collections -- read all

// update Collection -- add books
// app.post('/collections/update/addBooks')



app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});