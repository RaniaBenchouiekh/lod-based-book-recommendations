import React, { Component } from 'react';
import StarRating from './StarRating';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import auth from 'solid-auth-client'
import  { webidToUri, createRatedBooksFolder } from '../../Solid/Communication'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../../Toast/ToastMethods'
import ReactTooltip from 'react-tooltip'


//One card component
class BookCard extends Component {
    constructor (props) {
        super(props);
        this.state={
            title : props.title,
            subtitle : props.subtitle, 
            author : props.author,
            publisher : props.publisher,
            published : props.published,
            genres : props.genres,
            language : props.language,
            rating : props.rating,
            link : props.link,
            provider : props.provider,
            image : props.image,
            isbn : props.isbn,
            abstract : props.abstract,
            pages : props.pages,
            uri: null,
            link: props.link
        }
    }

    async componentDidMount(){
        try {
            let session = await auth.currentSession();
            await auth.fetch(session.webId)
            let urii = webidToUri(session.webId)
            await this.setState({ uri: urii })
        }
        catch(err){
            
            console.log(err);
        }
    }

    render (){
        return(
            <div className="BookCard-cardWrapper">
                <ReactTooltip
                        id="allTooltip"
                        place={'bottom'}
                        type={'info'}
                        multiline={true}
                        effect={'float'}
                        textColor={'#eae7dc'}
                        backgroundColor={'#8e8d8a'}
                        delayShow={300}
                />
                <Flippy
                    flipOnHover={false}
                    flipOnClick={true}
                    flipDirection="horizontal" 
                    style={{ width: '170px', height: '275px' }} 
                >
                <a data-for="allTooltip" data-tip="Click on the card to view more informations" data-iscapture="true">               
                    <FrontSide
                        style={{
                            backgroundColor: '#386e8a',
                            padding: 0,
                            cursor: 'pointer'
                        }}
                        >
                        <div className="BookCard-image">
                            <img src={this.state.image} alt="Book cover image"></img>
                        </div>
                        <div id='BookCard-title-container'>
                            <p id="BookCard-title">{this.state.title}</p>
                        </div>
                        <div className="BookCard-cardFront">
                            <StarRating className="BookCard-stars"
                                uri={this.state.uri}
                                title={this.state.title}
                                subtitle={this.state.subtitle}
                                author={this.state.author}
                                publisher={this.state.publisher}
                                published={this.state.published}
                                genres={this.state.genres}
                                language={this.state.language}
                                rating={this.state.rating}
                                link={this.state.link}
                                provider={this.state.provider}
                                image={this.state.image}
                                isbn={this.state.isbn}
                                abstract={this.state.abstract}
                                pages={this.state.pages}
                            />
                        </div>
                        <div className="BookCard-provider">
                            <p>Provider : {this.state.provider}</p>
                        </div>
                    </FrontSide>
                </a>
                    <BackSide
                        style={{ 
                            backgroundColor: '#386e8a',
                            fontSize: '13.5px',
                            paddingTop: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        <div className='BookCard-info'><p><b>Title : </b>{this.state.title}</p></div>
                        <div className='BookCard-info'> { this.state.subtitle==='none' ? null : <p><b>Subtitle : </b>{this.state.subtitle}</p> } </div>
                        <div className='BookCard-info'> { this.state.author===[] || this.state.author==='none' ? null : <p><b>Authors : </b>{this.state.author}</p> } </div>
                        <div className='BookCard-info'> { this.state.published==='0000' ? null : <p><b>Release Date : </b>{this.state.published.substring(0,4)}</p> } </div>
                        <div className='BookCard-info'> { this.state.genres===[] || this.state.genres==='none' ? null : <p><b>Genre : </b>{this.state.genres}</p> } </div>
                        <div className='BookCard-info'> { this.state.language==='none' ? null : <p><b>Language : </b>{this.state.language}</p> } </div>
                        <div className='BookCard-info'> { this.state.rating===0 ? null : <p><b>Rating : </b>{this.state.rating}</p> } </div>
                        
                        <a href={this.state.link} id="BookCard-about" target="__blank">About the book</a>
                    </BackSide> 
                </Flippy>
            </div>
        )
    }
}
export default BookCard;