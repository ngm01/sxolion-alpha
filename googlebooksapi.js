const request = require('request');

var googleBooksApiRequest = (title)=>{

    return new Promise((resolve, reject)=>{
        request({
            url: `https://www.googleapis.com/books/v1/volumes?q=${title}`,
            // json: true
        }, (error, response, body)=>{
            if(error){
                reject("Error:", error);
            } else {
                resolve(body);
            }
        })
    })
}

module.exports = {
    googleBooksApiRequest
}