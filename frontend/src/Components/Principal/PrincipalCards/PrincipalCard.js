import React from 'react'
import './PrincipalCards.scss'
import StarRating from '../../Steps/Ratings/StarRating';
import { createSavedBooksFile, removeSavedBook } from '../../Solid/Communication'
import quote1 from '../../../Assets/greyQuote1.png'
import quote2 from '../../../Assets/greyQuote2.png'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

class PrincipalCard extends React.Component{

    constructor () {
        super()
        this.state = {
            saved: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
    }

    handleChange (event) {
        try {
            this.setState({ [event.target.name]: event.target.checked });
            if(event.target.checked) createSavedBooksFile( this.props.userUri, this.props.isbn, this.props.title.split(' ').join('_'), this.props.subtitle,
                                                           this.props.abstract, this.props.pages, this.props.author, this.props.language, 
                                                           this.props.published, this.props.genres, this.props.image, this.props.provider )
            else removeSavedBook(this.props.userUri, this.props.title.split(' ').join('_')+".ttl")
        }
        catch(err){
            
            console.log(err);
        }
    }

    deleteBook () {
        try {
            removeSavedBook(this.props.userUri, this.props.title.split(' ').join('_')+".ttl")
            //delete the element
            var Tags = document.getElementsByTagName("h1");
            var searchText = this.props.title.split('_').join(' ');
            var found;

            for (var i = 0; i < Tags.length; i++) {
                if (Tags[i].textContent == searchText) {
                    found = Tags[i];
                    break;
                }
            }
            found.parentElement.parentElement.parentElement.style.display='none'
        }
        catch(err){
            
            console.log(err);
        }
    }

    render(){

        return (
            <div className="PC-card">

                <div className="PC-imageData">
                    <div className="PC-backgroundImage">
                        <img className="PC-cardImage" src={this.props.image} alt="Book Cover"/>
                    </div>

                    <div className="PC-publicationDetails">
                        <span className="PC-subtitle">{this.props.subtitle !== "none" ? this.props.subtitle : null}</span>
                        <span className="PC-releaseDate">{this.props.published !== "none" ? "In " + this.props.published.substring(0, 4) : null}</span>
                        <span className="PC-author">{this.props.author !== "none" ? "By " + this.props.author : null}</span>
                        <span className="PC-language">{this.props.language !== "none" ?  this.props.language +" (Original)": null}</span>
                        <span className="PC-country">{this.props.country !== "none" ? this.props.country : null}</span>
                        <span className="PC-numberOfPages">{this.props.pages !== "none" ? this.props.pages + " pages" : null}</span>
                    </div>
                </div>

                <div className="PC-postData">
                    <div className="PC-cardHeader">
                        <h1 className="PC-title">{this.props.title !== "none" ? this.props.title : null}</h1>
                        <div className="PC-completeTitle">{this.props.title !== "none" ? this.props.title : null}</div>
                        { 
                            this.props.heart==="empty" 
                            &&
                            <div className="PC-heart">
                                <input type="checkbox" name="saved" onChange={this.handleChange} defaultChecked={this.props.saved!==undefined ? true : false} />
                            </div>
                            ||
                            this.props.heart==="filled"
                            && 
                            <button className="PC-delete" onClick={this.deleteBook}>-</button>
                        }   
                        
                    </div>
                    {
                        (this.props.score!==undefined && this.props.score!==0)
                        ? 
                        <p className="PC-score">Probability of liking : <span>{Math.floor(this.props.score*100)}%</span></p>
                        :
                        <h2 className="PC-provider">{this.props.provider !== "none" ? "Provided by " + this.props.provider : null}</h2>
                    }

                    <p className="PC-description PC-descriptionEllipsis">  {this.props.abstract !== "none" ? this.props.abstract :  <span> Abstract unavailable. <br/> Click on 'Read More' to view more informations.</span> }</p>
                    {
                        this.props.abstract !== "none"
                        &&
                        <div className="PC-descriptionHoverContainer" >
                            <img src={quote1} className="PC-descQuote1"/>
                            <p className="PC-descriptionHover"> {this.props.abstract !== "none" ? this.props.abstract : null} </p>
                            <img src={quote2} className="PC-descQuote2"/>
                            <span className="PC-descHoverMore">(Click on 'Read More' to view the rest)</span>
                        </div>
                    }
                    <div className="PC-cta">
                        <StarRating
                            ratingValue={this.props.ratingValue} 
                            uri={this.props.userUri}
                            title={this.props.title}
                            subtitle={this.props.subtitle}
                            author={this.props.author}
                            publisher={this.props.publisher}
                            published={this.props.published}
                            genres={this.props.genres}
                            language={this.props.language}
                            rating={this.props.rating}
                            link={this.props.link}
                            provider={this.props.provider}
                            image={this.props.image}
                            isbn={this.props.isbn}
                            abstract={this.props.abstract}
                            pages={this.props.pages}
                        />
                        <a href={this.props.link==='none' ? '#' : this.props.link} target="__blank">Read More</a>
                    </div>
                </div>
                <ToastContainer />
            </div>
        )
    }
}
export default PrincipalCard