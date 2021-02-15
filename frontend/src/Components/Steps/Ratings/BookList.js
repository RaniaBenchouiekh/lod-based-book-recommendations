import React from 'react';
import './ratings.scss';
import BookCard from './BookCard';

//The book list (all the cards, each one identified by a unique key (i))
const BookList= (props)=>{ 
        return (
            <div className="BookList-list">
                {
                    props.books.booksResults.map((book,i)=>{
                        return  <BookCard 
                                    key={book.id}
                                    image={book.image==="none" ? 'http://localhost:3002/book.png' : book.image}
                                    title={book.title}
                                    author={book.authors}
                                    publisher={book.publisher}
                                    published={book.published}
                                    subtitle={book.subtitle}
                                    genres={book.genres}
                                    language={book.language}
                                    provider={book.provider}
                                    link={book.link}
                                    rating={book.rating}
                                    isbn={book.isbn13}
                                    abstract={book.abstract}
                                    pages={book.pages}
                                    link={book.link}
                                    />
                    })
                }
            </div>
        )
}
export default BookList;