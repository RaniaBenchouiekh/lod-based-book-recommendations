/*global chrome*/
import React, { Component } from 'react';
import auth from 'solid-auth-client'
import { createSavedBooksFolder, createRecommendersFile, createRatedBooksFolder, 
         webidToUri, verifyAccess, readInfoPerso, readRatedBooks, createAppDataFile } from '../../Solid/Communication'
import Stepper from 'react-stepper-horizontal'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { errorToast, succesToast } from '../../Toast/ToastMethods'
import ReactTooltip from 'react-tooltip'
import './ratings.scss'
import './tooltip.css'
import '../InfoPerso/InfoPerso.scss';
import loader from '../../../Assets/oval.svg'
import Principal from '../../Principal'
import SearchArea from './SearchArea';
import BookList from './BookList';
import Header from '../Header'

class Ratings extends Component{
    constructor(props){
        super(props);
        this.state={
            books : [], //The retreived books from the API
            searchField: '', //The search field text
            loading: true,
            searchClicked: false,
            defautBooks : [],
            genres : props.genres,
            showMe : false,
            userUri : '',
            profileImage: '',
            finishLoading: false,
            fetchErr: false
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.searchBook = this.searchBook.bind(this)
        this.goToPrincipal = this.goToPrincipal.bind(this)
    }
    //The search field handler ( to capture the keyword )
    handleSearch (event) {
        this.setState({searchField : event.target.value}) 
    }

    fetchBooks () {
        try{
            var genre=[this.state.searchField] 
            fetch('http://localhost:3002/books/genres?genre='+genre)
            .then(res => res.json())
            .then(books => {
                this.setState({fetchErr: false})
                this.setState({books});
                this.setState({loading: false})
            })
            .catch(()=>{
                console.log('Failed to fetch error')
                this.setState({ fetchErr: true, loading: false })
            });
        }
        catch(err){
            this.setState({ fetchErr: true, loading: false })
            console.log(err);
        }
    }

    async searchBook (event) {
        event.preventDefault(); //to prevent the form from calling a server since we're not using one
        if(this.state.searchField!==''){
            this.setState({ searchClicked:true, loading: true })
            this.fetchBooks()
        }
    }
    
    async componentDidMount () {
        var error = false
        this.setState({ enableSearch: false })
        try {
            //Test connexion
            try{
                let session = await auth.currentSession();
                var cnx = await auth.fetch(session.webId);  
            }
            catch(err){
                this.setState({ finishLoading: false })
                errorToast('Connexion error')
                error=true
            }

            if(!error){
                let session = await auth.currentSession();
                let uri = webidToUri(session.webId)
                this.setState({ userUri: uri })

                //Test prmissions
                let verif = await verifyAccess(session.webId)
                if (!verif){
                    this.setState({ finishLoading: false })
                    errorToast('You must check all access modes options in your Solid pod')
                    throw new Error('not enough permissions') 
                } 

                //Get the photo of the user's pod
                var card = await readInfoPerso(uri)
                if(card.image!=='none') this.setState({ profileImage: card.image })

                //Get the books that correspond to the user's favorite genres
                var allGenres = this.state.genres.join(",")
                await fetch('http://localhost:3002/books/genres?genre='+allGenres)
                .then(res => res.json())
                .then(books => {
                    this.setState({fetchErr: false})
                    this.setState({defautBooks:books}); 
                    this.setState({loading: false})
                })
            }    
        }
        catch(err){
            this.setState({ fetchErr: true, loading: false })
            console.log(err);
        }
        this.setState({ enableSearch: true })
    }

    async goToPrincipal () {
        try{
            this.setState({ finishLoading: true })

            //Test prmissions
            let session = await auth.currentSession();
            let verif = await verifyAccess(session.webId)
            if (!verif) {
                this.setState({ finishLoading: false })
                errorToast('You must check all access modes options in your Solid pod')
                throw new Error('Not enough permissions')
            }

            await createRecommendersFile(this.state.userUri, false, false, false)
            await createAppDataFile(this.state.userUri, 0, new Date())

            var books = await readRatedBooks(this.state.userUri,0).then( (result)=>{ return result })
            let arr = books.split("%%")
            if(arr.length>1){
                this.setState({ finishLoading: false })
                succesToast("Save succeded")
                setTimeout(()=>{
                    this.setState({ showMe : true });
                },3000)
            }
            else{
                this.setState({ finishLoading: false })
                errorToast("You have to rate at least one book")
            }
        }
        catch(err){
            console.log(err);
        }
    }

    renderCards(){

            if(this.state.loading) {
                return <img src={loader} style={{marginTop: '100px'}}/>
            }
            else 
                if(this.state.fetchErr) return <div className="BookCards-fetchErr">Error in fetching Google Books</div>
                else
                    if(!this.state.searchClicked){
                        if(this.state.defautBooks.booksResults!==undefined && this.state.defautBooks.booksResults.length===0) return <div className="BookCards-fetchErr">No results available</div>
                        else
                            return (
                                <div>
                                <ReactTooltip
                                        id="thisTool1"
                                        className="Ratings-tooltip"
                                        place={'bottom'}
                                        type={'info'}
                                        multiline={true}
                                        effect={'float'}
                                        textColor={'#eae7dc'}
                                        backgroundColor={'#8e8d8a'}
                                        delayShow={300}
                                    />
                                    <div className="BookCards-ListContainer">
                                        <BookList books={this.state.defautBooks}/>
                                    </div>
                                </div>
                            )
                    }
                    else {
                        if(this.state.books.booksResults!==undefined && this.state.books.booksResults.length===0) return <div className="BookCards-fetchErr">No results available</div>
                        else
                            return (
                                <div>
                                    <ReactTooltip
                                    id="thisTool2"
                                    className="Ratings-tooltip"
                                    place={'bottom'}
                                    type={'info'}
                                    multiline={true}
                                    effect={'float'}
                                    textColor={'#eae7dc'}
                                    backgroundColor={'#8e8d8a'}
                                    delayShow={300}
                                />
                                    <div className="BookCards-ListContainer" >
                                        <BookList books={this.state.books}/>
                                    </div>
                                </div>
                            )
                    }
        }

    render(){
        if(this.state.showMe) { 
            return <Principal />
        }
        else
            return(
                <div className="Ratings-wrapper">
                    <ReactTooltip
                        id="thisTool"
                        className="Ratings-tooltip"
                        place={'bottom'}
                        type={'info'}
                        multiline={true}
                        effect={'float'}
                        textColor={'#eae7dc'}
                        backgroundColor={'#8e8d8a'}
                        delayShow={300}
                    />
                    
                    <Header />

                    <div className="Books-StepsHeader">
                    <Stepper 
                        steps={ [
                            {title: 'Insert personal information'},
                            {title: 'Choose genres'}, 
                            {title: 'Rate some books'}
                        ] } 
                        circleTop= { 5 }
                        activeStep={ 2 }
                        activeOpacity ={'0.7'} 
                        activeColor = { '#bdd1bd' }
                        activeTitleColor = { '#bdd1bd' }
                        completeColor = { '#3cb35e' }
                        completeTitleColor = { '#3cb35e' }
                        size={ 30 }
                        circleFontSize = { 13 }
                        titleFontSize= { 15 }
                        completeBarColor= {'#3cb35e' }
                        />
                    </div>   
                    <div className="Books-wrapper">
                        <div className="Books-booksWrapper">
                            <div id="Books-search">
                                <div className="Books-booksHeader">
                                    <h2>Rate your favorite books</h2>
                                    <p>The books you rate help us find out your taste and what you would like as suggestions</p>
                                </div>
                                <SearchArea enableSearch={this.state.enableSearch} searchBook={this.searchBook} handleSearch={this.handleSearch} />
                            </div>    
                            {this.renderCards()}
                            <a data-for="thisTool2" data-tip="Get to the application" data-iscapture="true">
                                <div className='BookCards-SubmitContainer'>
                                    <button className='BookCards-Submit' onClick={this.goToPrincipal}>Finish</button>
                                </div>
                            </a>
                            {
                                this.state.finishLoading ?
                                <img className="BookCards-loader"></img>
                                : null
                            }
                        </div>
                    </div>
                    <div className="Books-imageBack1"></div>
                    <div className="Books-imageBack2"></div>
                    <ToastContainer />
                </div>
            );
    }
}
export default Ratings;
