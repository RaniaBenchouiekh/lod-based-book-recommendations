import React  from 'react'
import PrincipalCard from '../PrincipalCards/PrincipalCard'
import './BooksList.scss'
import loader from '../../../Assets/oval.svg'
import { readRatedBooks, webidToUri, readSavedBooks } from '../../Solid/Communication'
import auth from 'solid-auth-client'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../../Toast/ToastMethods'



class RatedBooks extends React.Component {
    constructor() {
        super()
        this.state = {
            booksToRate: [],
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

            //Get URI of the user
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

            //Add field 'saved'
            jsonArr1.map((book1)=>{
                jsonArr2.map((book2)=>{
                    if(book1.title.split(' ').join('_')===book2.title) { book1["saved"] = "true"; }
                })
            })

            //Sort
            jsonArr1.sort((a, b)=> {  
                if (a["rateDate"] > b["rateDate"]) {  
                    return -1;  
                } else 
                    if (a["rateDate"] < b["rateDate"])
                    return 1; 
            })

            console.log(jsonArr1)
            await this.setState({ booksToRate: jsonArr1, loading: false })

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
        const data = this.state.booksToRate
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
                            <img src={loader} style={{ marginLeft: '40px' }}/>
                        </div>
                    </div>
                )
            }
            else
                if(this.state.booksToRate.length===0){
                    return (
                        <div className="RatedBooks-emptyListContentWrapper">
                            <div className="RatedBooks-emptyList">No book is rated</div>
                        </div>
                    )
                }
                else {
                    return (
                        <div className="RatedBooks-contentWrapper">
                            <div className="RatedBooks-searchWrapper">
                                <h2>Rated books</h2>
                                <div id="RatedBooks-searchArea">
                                    <form onSubmit={this.searchBook} action="" className="RatedBooks-searchForm">
                                        <input type="text" value={filter} onChange={this.handleChange} className="RatedBooks-searchField" placeholder="Filter rated books" ></input>
                                    </form>
                                </div>
                            </div>
                            <div className="RatedBooks-content">
                                {
                                    filteredData.map((book)=>{
                                        return <PrincipalCard 
                                                key={book.title}
                                                userUri={this.state.userUri}
                                                id={book.title}
                                                isbn={book.isbn}
                                                provider={book.source}
                                                title={book.title.split('_').join(' ')}
                                                subtitle={book.subtitle}
                                                published={book.releaseDate}
                                                language={book.language}
                                                pages={book.numberOfPages}
                                                author={book.author}
                                                abstract={book.abstract}
                                                image={book.photo}
                                                heart="empty"
                                                ratingValue={book.ratingValue}
                                                publisher={book.publisher}
                                                genres={book.literaryGenre}
                                                link={book.link}
                                                saved={book.saved}
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
export default RatedBooks