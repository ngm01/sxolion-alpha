const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const googleBooksApiRequest = require('./googlebooksapi');

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

app.get('/searchBooks', (req, res)=>{
    var titleSearch = req.query.title;
    googleBooksApiRequest.googleBooksApiRequest(titleSearch).then((googleApiResponse)=>{
        books = JSON.parse(googleApiResponse).items;
        res.send(books);
    })
})


app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});