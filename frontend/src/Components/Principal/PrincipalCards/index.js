import React from 'react'
import './PrincipalCards.scss'
import PrincipalCard from './PrincipalCard'
import loader from '../../../Assets/oval.svg'
import { webidToUri } from '../../Solid/Communication'
import auth from 'solid-auth-client'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../../Toast/ToastMethods'


class PricipalCards extends React.Component{
    constructor() {
        super()
        this.state = {
            booksToRecommend: null,
            loading: true,
            userUri: null
        }
    }

    async componentDidMount () {
        try{
            let session = await auth.currentSession();
            let uri = webidToUri(session.webId)
            this.setState({ userUri: uri })
            this.setState({ booksToRecommend : this.props.books, loading: false })
        }
        catch(err){
            console.log(err);
        }
    }

    renderCards () {
        if(this.state.loading) {
            return <img src={loader} style={{marginTop: '200px', marginLeft: '545px'}}/>
        }
        else {
            return (
                <div className="PC-cardsContainer">
                {
                    this.state.booksToRecommend.map((book)=>{
                        return <PrincipalCard 
                                     key={book.id}
                                     userUri={this.state.userUri} 
                                     id={book.id}
                                     isbn={book.isbn13}
                                     provider={book.provider}
                                     title={book.title}
                                     subtitle={book.subtitle}
                                     publisher={book.publisher}
                                     published={book.published}
                                     genres={book.genres}
                                     language={book.language}
                                     pages={book.pages}
                                     author={book.authors}
                                     abstract={book.abstract}
                                     image={book.image}
                                     link={book.link}
                                     heart="empty"
                                     ratingValue={-1}
                                     saved={book.saved}
                                     ratingValue={book.ratingValue}
                                     score={book.score}
                                 />
                    })
                }
                </div>
            )
        }
    }
    render(){
        return (
            <div className="PC-cardList">
                {this.renderCards()}
                <ToastContainer />
            </div>
        )
    }
}
export default PricipalCards
/**

       var books = [
            {
                "id": '1',
                "provider": 'Google Books',
                "title": 'rano',
                "author": 'mousiba',
                "subtitle": 'mousiba 2',
                "published": '1996',
                "language": 'en',
                "pages": '3 brk',
                "abstract": 'rano atfalon sigharon kda menna melhih w l omor ..',
                "image": 'url1'
            },
            {
                "id": '2',
                "provider": 'goodReads',
                "title": 'moh',
                "author": 'mickhobe',
                "subtitle": 'mickhobe 2',
                "published": '1996',
                "language": 'fr',
                "pages": 'ksh 88',
                "abstract": 'moh haja kbira kda menna melhih w l omor ..',
                "image": 'url2'
            },
            {
                "id": '3',
                "provider": 'ITBooks',
                "title": 'rano',
                "author": 'mousiba',
                "subtitle": 'mousiba 2',
                "published": '1996',
                "language": 'en',
                "pages": '3 brk',
                "abstract": 'rano atfalon sigharon kda menna melhih w l omor',
                "image": 'url3'
            }
       ] */