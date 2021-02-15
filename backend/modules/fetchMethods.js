var exports = module.exports={};
var fetch = require('node-fetch');
var convert = require('xml-js');

const APIKEY = 'AIzaSyDeUA5KYqJRpGqxVHpzHqAbmWPuHfHQL0o'

//FETCHING ___________________________________________________________________________
    //Fetch in Google Books by genre
     async function getGoogleBooksGenres (genre, page) {
        let data = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${genre}&key=${APIKEY}&maxResults=20&startIndex=${(page-1)*20}`)
                            .then(response => response.json())
                            .then( json => {  return(json)  })
                            .catch(error => { console.log('Error : Error in fetching\nProvider : Google Books'); });
        return data
    }


//CREATING THE JSON FILE ___________________________________________________________________________

 exports.getJsonFileGenres= async function(attribute, page){
    //Create a new json object
    var Books = {"booksResults":[]}

    //Create the Google Books json file
    page = page || 1
    let d = await getGoogleBooksGenres(attribute, page)
    
    if(d!==undefined){
        let data = d.items
        if(data!==undefined)
            for (let i = 0; i < data.length; i++) {
                Book = {
                    "id": data[i].volumeInfo.infoLink,
                    "isbn13": data[i].volumeInfo.industryIdentifiers===undefined || data[i].volumeInfo.industryIdentifiers[1]===undefined ? "none" : data[i].volumeInfo.industryIdentifiers[1].identifier,
                    "title": data[i].volumeInfo.title,
                    "subtitle": data[i].volumeInfo.subtitle === undefined ? "none" : data[i].volumeInfo.subtitle,
                    "abstract": data[i].volumeInfo.description === undefined ? "none" : data[i].volumeInfo.description,
                    "authors": data[i].volumeInfo.authors === undefined ? "none" : data[i].volumeInfo.authors,
                    "publisher": data[i].volumeInfo.publisher === undefined ? "none" : data[i].volumeInfo.publisher, 
                    "published": data[i].volumeInfo.publishedDate === undefined ? "none" : data[i].volumeInfo.publishedDate, 
                    "genres": data[i].volumeInfo.categories === undefined ? "none" : data[i].volumeInfo.categories,
                    "language": data[i].volumeInfo.language === undefined ? "none" : data[i].volumeInfo.language,
                    "pages": data[i].volumeInfo.pageCount === undefined ? "none" : data[i].volumeInfo.pageCount,
                    "image": data[i].volumeInfo.imageLinks ===undefined ? "http://localhost:3002/book.png" : data[i].volumeInfo.imageLinks.thumbnail,
                    "link": data[i].volumeInfo.infoLink === undefined ? "none" : data[i].volumeInfo.infoLink,
                    "provider": "Google Books",
                    "rating": data[i].volumeInfo.averageRating===undefined ? 0 : data[i].volumeInfo.averageRating,
                    "totalBooks": d.totalItems
                }
                Books.booksResults.push(Book);
            }
    }
    return Books
}
     
    exports.getJsonFileAuthors= async function(attribute){
        //Create a new json object
        var Books = {"booksResults":[]}  

        //Create the Google Books json file
        let data = await getGoogleBooksAuthors(attribute)
        if(data!==undefined)
            for (let i = 0; i < data.length; i++) {
                Book = {
                    "id": data[i].volumeInfo.infoLink,
                    "isbn13": data[i].volumeInfo.industryIdentifiers===undefined || data[i].volumeInfo.industryIdentifiers[1]===undefined ? "none" : data[i].volumeInfo.industryIdentifiers[1].identifier,
                    "title": data[i].volumeInfo.title,
                    "subtitle": data[i].volumeInfo.subtitle === undefined ? "none" : data[i].volumeInfo.subtitle,
                    "abstract": data[i].volumeInfo.description === undefined ? "none" : data[i].volumeInfo.description,
                    "authors": data[i].volumeInfo.authors === undefined ? "none" : data[i].volumeInfo.authors,
                    "publisher": data[i].volumeInfo.publisher === undefined ? "none" : data[i].volumeInfo.publisher, 
                    "published": data[i].volumeInfo.publishedDate === undefined ? "none" : data[i].volumeInfo.publishedDate, 
                    "genres": data[i].volumeInfo.categories === undefined ? "none" : data[i].volumeInfo.categories,
                    "language": data[i].volumeInfo.language === undefined ? "none" : data[i].volumeInfo.language,
                    "pages": data[i].volumeInfo.pageCount === undefined ? "none" : data[i].volumeInfo.pageCount,
                    "image": data[i].volumeInfo.imageLinks ===undefined ? "http://localhost:3002/book.png" : data[i].volumeInfo.imageLinks.thumbnail,
                    "link": data[i].volumeInfo.infoLink === undefined ? "none" : data[i].volumeInfo.infoLink,
                    "provider": "Google Books",
                    "rating": data[i].volumeInfo.averageRating===undefined ? 0 : data[i].volumeInfo.averageRating
                }
                Books.booksResults.push(Book);
            }
        
        return Books
    }
    
    exports.rankingSorter = function (firstKey/*,secondKey*/) {
    return function(a, b) {  
        if (a[firstKey] > b[firstKey]) {  
            return -1;  
        } else if (a[firstKey] < b[firstKey]) {  
            return 1;  
        }  
        else return 0;
    }  
}