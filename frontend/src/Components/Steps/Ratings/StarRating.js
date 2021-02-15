import React,{useState, Component} from 'react';
import {FaStar} from 'react-icons/fa';
import { createRatedBooksFile } from '../../Solid/Communication'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../../Toast/ToastMethods'
 


//The stars component ( 5 stars (Array of 5))
class StarRating extends Component { 

    constructor(props){
        super(props)
        this.state = {
            rating: 0,
            hover: 0
        }
    }

    setRating(rate){
        this.setState({ rating: rate })
    }    

    setHover(rate){
        this.setState({ hover: rate })
    }    

    componentDidMount(){
        if(this.props.ratingValue!==-1) this.setRating(this.props.ratingValue);
    }
    
    render(){
        return <div>
            {
            [...Array(5)].map((star,i)=>{
                const ratingValue = i+1;
                return  <label key={Math.floor(Math.random() * 999999999)}>
                            <input 
                                type="radio" 
                                name="rating" 
                                value={ratingValue}
                                onClick={
                                    ()=> {
                                        this.setRating(ratingValue);
                                        try {
                                            if(this.props.uri===null) throw new Error("Connexion error")
                                            createRatedBooksFile(this.props.uri, ratingValue, this.props.isbn, this.props.title.split(' ').join('_'), this.props.subtitle,
                                                this.props.abstract, this.props.pages, this.props.author, this.props.language, this.props.published, this.props.publisher,
                                                this.props.genres, this.props.image, this.props.provider, this.props.link)
                                        }catch(err){
                                            
                                            console.log(err)
                                        }
                                    }
                                }
                                className='StarRating-radio'
                            />
                            <FaStar
                                className="StarRating-star" 
                                size={18}
                                color ={ratingValue <= (this.state.hover||this.state.rating) ? "#ffc107":"#cfcfcf"}
                                onMouseEnter={()=>{this.setHover(ratingValue)}}
                                onMouseLeave={()=>{this.setHover(null)}}
                            />
                        </label>;
            })}
        </div>
    }
};
export default StarRating;