import React  from 'react'
import './Principal.scss'
import 'react-toastify/dist/ReactToastify.css';
import PrincipalCard from './PrincipalCards';
import loader from '../../Assets/oval.svg'
import searchIcon from '../../Assets/searchIcon.png'
import recommHome from '../../Assets/recomm-home-icon.png'
import { readRatedBooks, readSavedBooks, webidToUri, readRecommendersFile, removeFolders } from '../Solid/Communication'
import auth from 'solid-auth-client'
import { Link } from 'react-router-dom'
import {ToastContainer} from "react-toastify";
import Carousel from '../Principal/Carousel'

var CrossStorageClient = require('cross-storage').CrossStorageClient;


class Principal extends React.Component {
    constructor () {
        super()
        this.state = {
            searchField: '', //The search field text
            loading: true,
            books: null,
            searchClicked: false,
            booksToRecommend: [],
            userUri: '',
            rsFileContent: '',
            LodsLoggedIn: true,
            rsCnxError: false,
            cnxError: false,
            page: 1,
            totalSearchPages: 0
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.searchBook = this.searchBook.bind(this);
        this.returnToRecommendations = this.returnToRecommendations.bind(this);
    }
    
    async componentDidMount(){
        var cnxErr = false
        try{
            try{
                //Test connexion
                let session = await auth.currentSession();
                await auth.fetch(session.webId)
            }catch(err){
                this.setState({ cnxError: true, loading: false })
                cnxErr=true
            }
            if(!cnxErr){
                //get session
                let session = await auth.currentSession();
                let uri = webidToUri(session.webId)
                this.setState({ userUri: uri })

                //read Recommenders File 
                let rsFileContent = await readRecommendersFile(uri)
                this.setState({ rsFileContent: rsFileContent })

                //get localStorage of RS's app
                let rs = await readRecommendersFile(uri)
                var storage;
                if(rs!==null){
                    if(rs.toString()==="LODS_Recommender_System") storage = new CrossStorageClient('http://localhost:5000/BooksRecommender/')
                        else if(rs.toString()==='SimC_Recommender_System') storage = new CrossStorageClient('http://localhost:5001/BooksRecommender/')
                            else if(rs.toString()==='SimP_Recommender_System') storage = new CrossStorageClient('http://localhost:5002/BooksRecommender/')
                }
                //Test cnx to the RS
                try{
                    let ratingsArray = storage.onConnect().then(function() {
                        return storage.get('booksRecommended', 'loginState');
                    })
                }
                catch(err){
                    this.setState({ rsCnxError: true, loading: false })
                    console.log(err)
                }

                //pour vider le pod
                //await removeFolders(uri)

                //Get rated profile Books
                var books = await readRatedBooks(uri,0).then( (result)=>{ return result })
                let arr1 = books.split("%%")
                let jsonArr1 = []
                for (let index = 1; index < arr1.length; index++) {
                    jsonArr1.push(JSON.parse(arr1[index]))
                }

                //Get saved profile Books
                var books = await readSavedBooks(uri).then( (result)=>{ return result })
                let arr2 = books.split("%%")
                let jsonArr2 = []
                for (let index = 1; index < arr2.length; index++) {
                    jsonArr2.push(JSON.parse(arr2[index]))
                }

                var jsonArr = jsonArr1.concat(jsonArr2)


                //Observer of LODS localstorage (recommendedBooks) 
                var interval = setInterval(async () => {

                    try {
                        let ratingsArray = storage.onConnect().then(function() {
                            return storage.get('booksRecommended', 'loginState');
                        })['catch']((err) => {
                            this.setState({ rsCnxError: true, loading: false })
                            console.log(err);
                        })
                        let LodsLocalStorage = await ratingsArray.then( res=> { return res } )
                        let BookRec = LodsLocalStorage[0]
                        let loginState = LodsLocalStorage[1]

                        this.setState({ rsCnxError: false })

                        if(loginState!==undefined && loginState!==null && loginState!=='') this.setState({ LodsLoggedIn: true })
                        else this.setState({ LodsLoggedIn: false })

                        if(BookRec!==undefined && BookRec!==null && BookRec!=='') {
                            
                            ratingsArray = JSON.parse(BookRec)

                            let recomm = await ratingsArray

                            /*recomm.map((Book1)=>{
                                jsonArr1.map((Book2)=>{
                                    if(Book1.title.split(' ').join('_')===Book2.title) { Book1["ratingValue"] = Book2["ratingValue"]; }
                                })
                            })
                            recomm.map((Book1)=>{
                                jsonArr2.map((Book2)=>{
                                    if(Book1.title.split(' ').join('_')===Book2.title) { Book1["saved"] = "true"; }
                                })
                            })*/
                            
                            this.setState({ booksToRecommend : recomm })
                            this.setState({loading: false })
                            console.log(this.state.booksToRecommend)
                            clearInterval(interval)
                        }
                    }
                    catch(err){
                        this.setState({ rsCnxError: true })
                        console.log(err)
                        clearInterval(interval)
                        this.setState({loading: false })
                    }

                }, 2000);

            }
        }
        catch(err){
            console.log(err);
        }
    }

    handleSearch (event) { this.setState({searchField : event.target.value})}

    async fetchBooks (page) {
        try{
            var keyword=[this.state.searchField] 
            //var page = this.state.page
            await fetch('http://localhost:3002/books/genres?genre='+keyword+'&page='+page)
            .then(res => res.json())
            .then(books => {
                this.setState({books});
                this.setState({loading: false})
            })
            .catch(()=>{
                this.setState({ books: null, loading: false })
            })
            await this.setState({ totalSearchPages: this.state.books.booksResults[0].totalBooks })
        }
        catch(err){
            console.log(err);
            this.setState({ books: null, loading: false })
        }
    }

    async searchBook (event) {
        event.preventDefault(); //to prevent the form from calling a server since we're not using one
        this.setState({ books:null })
        if(this.state.searchField!==""){
            this.setState({ searchClicked:true, loading: true })
            this.fetchBooks(1)
        }
    }
    
    async previous(){
        if(this.state.page>1) {
            var previousPage = this.state.page
            previousPage = previousPage-1
            this.setState({ page: previousPage })
            this.setState({loading: true})
            await this.fetchBooks(previousPage)
        }
    }

    async next(){
        console.log(this.state.books.booksResults[0].totalBooks)
        if(this.state.page<this.state.books.booksResults[0].totalBooks){
            var nextPage = this.state.page 
            nextPage=nextPage+1
            this.setState({ page: nextPage})
            this.setState({loading: true})
            await this.fetchBooks(nextPage)
        }
    }

    renderCards () {
        if(this.state.loading) return <img src={loader} style={{marginTop: '56px', marginLeft: '550px', marginBottom: '47px'}}/>
        else {
            if(this.state.cnxError) return <div className="Principal-notAvailable">Error in connexion. Please try to reload the page</div>
            else{
                if(this.state.searchClicked===true) {
                    if(this.state.books!==null && this.state.books.booksResults!==null && this.state.books.booksResults!==undefined && this.state.books.booksResults.length!==0) 
                        return <PrincipalCard books={this.state.books.booksResults} />
                    else 
                        return <div className="Principal-notAvailable">Results not available</div>
                }
                else{
                    if(this.state.rsFileContent===null)
                    return (
                        <div className='Principal-rsLoginButtonContainer'>
                            <div className='Principal-rsLoginButtonWrapper'>
                                <div className='Principal-rsLoginButton'>
                                    <Link to='/RecommenderSystems'>
                                        Choose a Recommender System
                                    </Link>
                                </div>
                            </div>
                            <div className='Principal-rsLoginButtonComment'>Before you get your recommendations you must be subscribed to a recommender system.<br/>
                               Head to the marketplace by clicking the button above.
                            </div>
                        </div>
                    )
                    else{
                        if(this.state.rsCnxError) return <div className="Principal-notAvailable">Error in connexion with the RS provider. Please try to reload the page</div>
                        else {    
                            if(this.state.booksToRecommend===undefined || this.state.booksToRecommend.length===0) return <div className="Principal-notAvailable">Recommendations not available</div>
                            else{
                                return <PrincipalCard books = {this.state.booksToRecommend} />
                            }  
                        }
                    }
                }
            }
        }
    }

    hideRsWarning () {
        document.getElementsByClassName('Principal-RSWarning')[0].style.display='none'
    }

    async returnToRecommendations () {
        await this.setState({ loading: true })
        await this.setState({ searchClicked: false })
        await this.setState({ loading: false })
    }


    renderRSWarning(){
        if(!this.state.LodsLoggedIn)
            return(
                <div className='Principal-RSWarning'>
                    <div> 
                        You are no longer connected to any recommendation system provider. Please, choose a provider from the setting section
                    </div>
                    <button onClick={this.hideRsWarning}>X</button>
                </div>
            )
        else
            return(
                <div></div>
            )
    }

    render(){
            return(
                <div className="Principal-wrapper">
                    {this.renderRSWarning()}

                    <div id="Principal-banner">
                        <Carousel />
                    </div>

                    <div className="Principal-contentWrapper">
                        <div className="Pricipal-searchWrapper">
                            <h2>Book recommendations</h2>
                            <div id="Principal-searchArea">
                                <form onSubmit={this.searchBook} action="" className="Principal-searchForm">
                                    <input onChange={this.handleSearch} type="text" className="Principal-searchField" placeholder="Search book by keyword" ></input>
                                    <button type="submit" className="Principal-searchButton"> <img src={searchIcon} /> </button>
                                </form>
                                <button className="Principal-recommendationsButton" onClick={this.returnToRecommendations}> <img src={recommHome}/> Recommendations </button>
                            </div>
                        </div>
                    
                        <div className="Principal-content">
                            {this.renderCards()}
                        </div>

                        { 
                            !this.state.loading && this.state.searchClicked && this.state.totalSearchPages>1 && this.state.books!==null
                            &&
                            <div className="Principal-pagination">
                                {
                                    this.state.page>1
                                    &&
                                    <button className="Principal-previous" onClick={this.previous.bind(this)} >&lt; Previous page</button>
                                }
                                {
                                    this.state.page<this.state.totalSearchPages
                                    &&
                                    <button className="Principal-next" onClick={this.next.bind(this)} >Next page &gt;</button>
                                }
                            </div> 
                        }
                    </div>
                    <ToastContainer />
                </div>
            )
    }
}
export default Principal