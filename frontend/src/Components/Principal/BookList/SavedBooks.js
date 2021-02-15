import React  from 'react'
import PrincipalCard from '../PrincipalCards/PrincipalCard'
import './BooksList.scss'
import loader from '../../../Assets/oval.svg'
import { readRatedBooks, webidToUri, readSavedBooks } from '../../Solid/Communication'
import auth from 'solid-auth-client'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../../Toast/ToastMethods'


class SavedBooks extends React.Component {
    constructor() {
        super()
        this.state = {
            booksToSave: [],
            loading: true,
            userUri: '',
            filter: '',
            cnxError: false
        }
    }
    async componentDidMount () {
        try{
            try{
                //Test connexion
                let session = await auth.currentSession();
                await auth.fetch(session.webId)
            }catch(err){
                this.setState({ cnxError: true })
            }

            //Get uri of the user
            let session = await auth.currentSession();
            let uri = webidToUri(session.webId)
            this.setState({ userUri: uri })

            //Get rated profile books
            var books = await readRatedBooks(uri,0).then( (result)=>{ return result })
            let arr1 = books.split("%%")
            let jsonArr1 = []
            for (let index = 1; index < arr1.length; index++) {
                jsonArr1.push(JSON.parse(arr1[index]))
            }

            //Get saved profile books
            var books = await readSavedBooks(uri).then( (result)=>{ return result })
            let arr2 = books.split("%%")
            let jsonArr2 = []
            for (let index = 1; index < arr2.length; index++) {
                jsonArr2.push(JSON.parse(arr2[index]))
            }

            //Add the field 'ratingValue'
            jsonArr2.map((book1)=>{
                jsonArr1.map((book2)=>{
                    if(book1.title.split(' ').join('_')===book2.title) { book1["ratingValue"] = book2["ratingValue"]; }
                })
            })

            //Sort
            jsonArr2.sort((a, b)=> {  
            if (a["saveDate"] > b["saveDate"]) {  
                return -1;  
            } else 
                if (a["saveDate"] < b["saveDate"])
                return 1; 
            })

            await this.setState({ booksToSave: jsonArr2, loading: false })
            console.log('this.state.booksToSave : '+this.state.booksToSave.length)
        }
        catch(err){
            console.log(err);
        }
    }

    handleChange = event => {
        this.setState({ filter: event.target.value });
    };

    renderCards () {
        const filter = this.state.filter;
        const data = this.state.booksToSave
        const lowercasedFilter = filter.toLowerCase();
        const filteredData = data.filter(item => {
            return Object.keys(item).some(key =>
            item[key].toLowerCase().includes(lowercasedFilter)
            );
        });

        if(this.state.cnxError) return <div className="RatedBooks-cnxError"><p>Error in connexion to the pod. Please try to reload the page</p></div>
        else {
            if(this.state.loading) {
                return (
                    <div className="RatedBooks-contentWrapper">
                        <div className="RatedBooks-loading">
                            <img src={loader} style={{marginLeft: '40px'}}/>
                        </div>
                    </div>
                )
            }
            else
                if(this.state.booksToSave.length===0){
                    return (
                        <div className="SavedBooks-emptyListContentWrapper">
                            <div className="SavedBooks-emptyList">No book is saved</div>
                        </div>
                    )
                }
                else {
                    return (
                        <div className="SavedBooks-contentWrapper">
                            <div className="SavedBooks-searchWrapper">
                                <h2>Saved books</h2>
                                <div id="SavedBooks-searchArea">
                                    <form action="" className="SavedBooks-searchForm">
                                        <input value={filter} onChange={this.handleChange}  type="text" className="SavedBooks-searchField" placeholder="Filter saved books" ></input>
                                    </form>
                                </div>
                            </div>
                            <div className="SavedBooks-content">
                                {
                                    filteredData.map((book)=>{
                                        return <PrincipalCard
                                                    key={book.title}
                                                    userUri={this.state.userUri}
                                                    id={book.title}
                                                    provider={book.source}
                                                    title={book.title.split('_').join(' ')}
                                                    subtitle={book.subtitle}
                                                    published={book.releaseDate}
                                                    language={book.language}
                                                    pages={book.numberOfPages}
                                                    author={book.author}
                                                    abstract={book.abstract}
                                                    image={book.photo}
                                                    link={book.link}
                                                    heart="filled"
                                                    ratingValue={book.ratingValue}
                                                />
                                    })
                                }
                            </div>
                        </div>
                    )
                }
        }
    }
    render(){
        return (
            <div>
                {this.renderCards()}
                <ToastContainer />
            </div>
        )
    }
}
export default SavedBooks