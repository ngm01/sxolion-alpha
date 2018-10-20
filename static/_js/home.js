var state = {
    books: [],
    collections: [{name: 'Dune Saga', id: 'aDkB4KOAfO', books: []}, {name: 'Classic Horror', id: 'hb39niJSPs', books: []}, {name: 'History of Philosophy', id: 'O1rkQT2tdq', books: []}]
}

document.addEventListener('DOMContentLoaded', ()=>{
    let collectionsList = "";
    state.collections.forEach((collection)=>{
        collectionsList += generateSelectOption(collection);
    })
    document.getElementById('collections-list').innerHTML = collectionsList;
})

var getBooks = () => {
    var titleSearch = document.querySelector('input[name=title]').value;
    fetch(`http://localhost:3000/searchBooks?title=${titleSearch}`).then((res)=>{
        return res.json()
        }).then((data)=>{
            state.books = data;
            generateBooksList(state.books);
        });
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
    return `<option value="${collection.id}">${collection.name}</option>`
}

var addBooksToCollection = ()=>{
    //TODO:
    //get array of selected book ids from document
    var selectedBooks = document.querySelectorAll('#book-search-results li input:checked'),
    fullBookRecords = [];
    
    selectedBooks.forEach((bookSelection)=>{
        state.books.forEach((bookRecord)=>{
            if(bookSelection.value == bookRecord.id){
                console.log(bookRecord.volumeInfo.title);
                fullBookRecords.push(bookRecord);
            }
        })
    })
    console.log(fullBookRecords);
    //get selected collection from document
    //get books by id from state.books
    //

}
