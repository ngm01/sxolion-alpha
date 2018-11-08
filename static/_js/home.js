var state = {
    books: [],
}

//Need loading animations to hide this stuff...
document.addEventListener('DOMContentLoaded', ()=>{
    getCollections();
})

var getCollections = ()=>{
    fetch('http://localhost:3000/collections').then((res)=>{
        return res.json();
    }).then((usersCollections)=>{
        collectionsList = '';
        usersCollections.forEach((collection)=>{
            collectionsList += generateSelectOption(collection);
        })
        document.getElementById('collections-list').innerHTML = collectionsList;
    })
}

var getBooks = () => {
    var titleSearch = document.querySelector('input[name=title]').value;
    fetch(`http://localhost:3000/searchBooks?title=${titleSearch}`).then((res)=>{
        return res.json()
        }).then((data)=>{
            state.books = data;
            generateBooksList(state.books);
        });
}

var createCollection = ()=>{
    let newCollection  = document.querySelector('input[name=new-collection]').value;
    console.log(newCollection);
    fetch('http://localhost:3000/collections/create', {
        method: 'post',
        body: JSON.stringify({newCollectionTitle: newCollection}),
        headers:{
            'Content-Type': 'application/json'
          }
    }).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log("createCollection complete:", data);
    })
}

var updateCollection = (ids, collection)=>{
    fetch('http://localhost:3000/collections/update', {
        method: 'post',
        body: JSON.stringify({ids: ids, collection: collection}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res)=>{
        console.log("Got a response updating a collection:" + res);
    })
}

var createBook = (bookRecord) =>{
    return new Promise((resolve, reject)=>{
        fetch('http://localhost:3000/books/create', {
            method: 'post',
            body: JSON.stringify({
                title: bookRecord.volumeInfo.title,
                authors: bookRecord.volumeInfo.authors,
                isbn13: bookRecord.volumeInfo.industryIdentifiers[0].identifier,
                googleBooksId: bookRecord.id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            //console.log("createBook complete:", data._id);
            resolve(data._id);
        }).catch((err)=>{
            reject(err);
        })
    })
}

var generateBooksList = (books)=>{
    if(books){
        booksList = "<ul>"
        for(x=0;x<books.length;x++){
            booksList += generateBookListItem(books[x]);
        }
        booksList += "</ul>"
        document.getElementById('book-search-results').innerHTML = booksList;
    }
}

var generateBookListItem = (bookData) => {
    let title = bookData.volumeInfo.title;
    let author = "n/a"
    if(bookData.volumeInfo.authors){
        author = bookData.volumeInfo.authors[0];
    }
    let id = bookData.id;

    return `<li>${title} by ${author} <input type='checkbox' value=${id}></li>`;
}

var generateSelectOption = (collection)=>{
    return `<option value="${collection.id}">${collection.title}</option>`
}

var addBooksToCollection = ()=>{
    var selectedBooks = document.querySelectorAll('#book-search-results li input:checked'),
    selectedCollection = document.getElementById('collections-list').value;
    fullBookRecords = [];  
    selectedBooks.forEach((bookSelection)=>{
        state.books.forEach((bookRecord)=>{
            if(bookSelection.value == bookRecord.id){
                //console.log("Title: " +bookRecord.volumeInfo.title);
                fullBookRecords.push(bookRecord);
            }
        })
    })
    newBook_idArray(fullBookRecords).then((_idArray)=>{
        Promise.all(_idArray).then((ids)=>{
            //Array.isArray(ids) // true
            // TODO: next steps:
            // hand this array of _id's off to the
            // /collections/update route on the server.
            updateCollection(ids, selectedCollection);
        })
    });

}
var newBook_idArray = (bookRecords)=>{
    return new Promise((resolve, reject)=>{
        let newBook_ids = [];
        bookRecords.forEach((book)=>{
            newBook_ids.push(createBook(book).then((res)=>{
                //res returns the _objectID
                return res;
            }));
        })
        resolve(newBook_ids);
        reject("Error creating newBook_ids.");
    })
}

