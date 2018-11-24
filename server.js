const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const googleBooksApiRequest = require('./googlebooksapi');
var {Collection} = require('./models/collection');
var {Book} = require('./models/book');
const qrcode = require('qrcode');

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

//CREATE collection
app.post('/collections/create', (req, res)=>{
    var requestBody = req.body;
    console.log("Creating new collection:", requestBody);
    var collection = new Collection({
        title: req.body.newCollectionTitle
    });
    collection.save().then((successful)=>{
        let collectionid = ObjectId(successful._id).toString();
        generateQrCode(collectionid);

    }, (err)=>{
        res.status(400).send(err);
        console.log("Error:", err)
    })
})

// READ ONE collection
app.get('/collections/:collectionId', (req, res)=>{
    let collectionId = req.params.collectionId;
    console.log(collectionId);
    if(!ObjectId.isValid(collectionId)){
        res.status(404).send();
    } else {
        Collection.findById(collectionId).then((collection)=>{
            populateBookArray(collection.books).then((populatedBooks=>{
                Promise.all(populatedBooks).then((books)=>{
                    collection.books = books;
                    res.status(200).send(collection);
                })
            }))
        }, (err)=>{
            console.log(err);
            res.status(500).send(err);
        })
    }    
})

//Why does this work??
//Specifically, why does the Promise wait for
//all of the findById response to be pushed
//before resolving?
var populateBookArray = (bookIds)=>{
    return new Promise((resolve, reject)=>{
        let populatedArray = [];
        bookIds.forEach((bookId)=>{
            populatedArray.push(Book.findById(bookId).exec().then((doc)=>{
                return doc;
            }))
        })
        resolve(populatedArray);
        reject("Error populating books array.");
    })
}

// READ ALL collections
app.get('/collections', (req, res)=>{
    Collection.find().then((collections)=>{
        res.send(collections);
    }, (e)=>{
        res.status(400).send(err);
    })
})

// UPDATE collection
app.post('/collections/update/', (req, res)=>{
    var requestBody = req.body;
    //console.log("Collection update: " + JSON.stringify(requestBody, undefined, 2));
    console.log("Collection _id:" + requestBody.collection);
    console.log("Book _id list: " + requestBody.ids);
    var newBooks = requestBody.ids;
    Collection.findById(requestBody.collection, (err, doc)=>{
        if(err){
            console.log("Error finding collection: " + err);
        } else {
            console.log("Current doc: "+ doc);
            var updatedBooks = doc.books.concat(newBooks);
            Collection.findByIdAndUpdate(doc._id, {books: updatedBooks}, {new: true}, function(err, model){
                if(err){
                    console.log("Error updating collection: " + err);
                    res.status(500).send("");
                } else {
                    console.log("Model: " + model);
                    res.status(200).send("Successfully updated collection.");
                }
            })
        }
    })
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

//READ ONE book -- skeletal version
app.get('/books/:bookId', (req, res)=>{
    let bookId = req.params.bookId;
    if(!ObjectId.isValid(bookId)){
        res.status(404).send();
    } else {
        Book.findById(bookId).then((success)=>{
            res.send(success);
        }, (err)=>{
            res.status(500).send(err);
        })
    }
})

//READ ALL books

//UPDATE book

//DELETE book


//assistance functions

var generateQrCode = (collectionId)=>{
    let filepath = path.join(__dirname + '/static/qrcodes/' + collectionId + '.png')
    //let path = '/static/qrcodes/' + collectionId + ".png"
    qrcode.toFile(filepath, collectionId, {
        color: {
            dark: '#111',
            light: '#0000'
        }
    }, (err)=>{
        if(err){
            console.log("Error creating QR code:")
            throw err;
        } else {
            console.log("Created QR code.");
        }
    });
}

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});