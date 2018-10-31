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
            console.log("createBook complete:", data._id);
            resolve(data._id);
        }).catch((err)=>{
            reject(err);
        })
    })
}

module.exports = {
    createBook
}