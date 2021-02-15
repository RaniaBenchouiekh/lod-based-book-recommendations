import React from 'react'
import Slider from 'infinite-react-carousel';
import './Carousel.scss'

export default class Carousel extends React.Component {
  render() {
    const settings =  {
      autoplay: true,
      autoplaySpeed: 6000,
      duration: 500,
      dots: false,
      arrows: true
    };
    return (
      <div>
        <Slider { ...settings }>
          <div className='Carousel-image1'>
              <div>
                  <h3>The ultimate book guide</h3>
                  <div className="Carousel-image1Comment1">Google Books allows you to search and browse books, manage bookshelves, view book details</div>
                  <div>+64000 DBpedia book instances exploited</div>
                  <div>Rate and save your favorite books in your Solid pod</div>
              </div>
          </div>
          {/*<div className='Carousel-image2'>
            
          </div>*/}
          <div className='Carousel-image3'>
            <div>
              <h3 className="Carousel-image3Comment1"><span>Google Books</span> is a service that searchs the full text 
                                                      of books and magazines that Google has stored</h3>
              <h3 className="Carousel-image3Comment2">Search for, read and download more than <span>10 million</span> free books!</h3>
            </div>
          </div>
        </Slider>
      </div>
    );
  }
}