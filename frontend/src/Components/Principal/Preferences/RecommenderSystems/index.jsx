import React,{Component} from 'react'
import './CardStyle.scss'
import { readRecommendersFile, webidToUri, createRecommendersFile } from '../../../Solid/Communication' 
import auth from 'solid-auth-client'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../../../Toast/ToastMethods'
import userImage from '../../../../Assets/user.png'
import akramImage from '../../../../Assets/akramImge.png'
import abdelaadimImage from '../../../../Assets/abdelaadimImage.png'
import hamidImage from '../../../../Assets/hamidImage.png'
import latifaImage from '../../../../Assets/latifaImage.png'
import mesaoudaImage from '../../../../Assets/mesaoudaImage.png'
import nihadImage from '../../../../Assets/nihadImage.png'
import souadImage from '../../../../Assets/souadImage.png'
import commentsIcon from '../../../../Assets/social.png'
import { Link } from 'react-router-dom'

var CrossStorageClient = require('cross-storage').CrossStorageClient;


class Cards extends Component{
    constructor () {
        super()
        this.state = {
            SimI: true, SimC: true, SimP: true,
            userUri: '',
            commentField: '',
            users1: [
                {
                    image: abdelaadimImage,
                    name: "abdelaadim",
                    date: '9/5/2020',
                    comment: "Simple, easy to use and you can switch it easily."
                },
                {
                    image: akramImage,
                    name: "akram1",
                    date: '3/6/2020',
                    comment: "I like it, it's free and it offers adequate recommendations."
                },
                {
                    image: latifaImage,
                    name: "Maya92",
                    date: '30/6/2020',
                    comment: "Works great, i recommend !"
                },
                {
                    image: hamidImage,
                    name: "mike33",
                    date: '24/7/2020',
                    comment: "Best one so far, no access to my personal stockage. Works nice ! i recommend."
                }
            ],
            users2: [
                {
                    image: mesaoudaImage,
                    name: "laylamarcus",
                    date: '10/12/2019',
                    comment: "Diversity of usage, i use it for movies recommendations as well as for books. "
                },
                {
                    image: souadImage,
                    name: "dounia",
                    date: '21/1/2020',
                    comment: "A great system that does not require all rights to your pod, gives adequate recommendations. "
                },
                {
                    image: userImage,
                    name: "rania",
                    date: '6/5/2020',
                    comment: "Best one so far, no access to my personal stockage. Works nice ! i recommend."
                }
            ],
            users3: [
                {
                    image: hamidImage,
                    name: "brian3",
                    date: '23/2/2020',
                    comment: "I love the fact that it's quite transparent, you can see the details behind it from the associated page."
                },
                {
                    image: nihadImage,
                    name: "lily",
                    date: '8/4/2020',
                    comment: "I like it."
                }
            ]

        }
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount () {
        try{
            let session = await auth.currentSession();
            let uri = webidToUri(session.webId)
            this.setState({ userUri: uri })

            var storage = new CrossStorageClient('http://localhost:5000/');

            let state = storage.onConnect().then(function() { return storage.get('loginState') })['catch'](function(err) { console.log(err) })
            let loginState = await state.then( res=> { return res } )
            if(loginState!=='connected') {
                document.getElementById('LODS').checked = false
            }
        
            let rs = await readRecommendersFile(uri)
            if(rs===null) {
                document.getElementById('LODS').checked = false
                document.getElementById('SimC').checked = false
                document.getElementById('SimP').checked = false
            }
            else if(rs.toString()==="LODS_Recommender_System") document.getElementById('LODS').checked = true
                else if(rs.toString()==='SimC_Recommender_System') document.getElementById('SimC').checked = true
                    else if(rs.toString()==='SimP_Recommender_System') document.getElementById('SimP').checked = true
        }
        catch(err){
            console.log(err);
        }
        
    }

    handleChange (event) { 
        this.setState({ commentField : event.target.value });
    }

    chooseLodsRecommender(){
        try{
            var storage = new CrossStorageClient('http://localhost:5000/BooksRecommender/');

            var interval = setInterval(async () => {
                let state = storage.onConnect().then(function() {
                    return storage.get('loginState');
                })['catch'](function(err) {
                    console.log(err);
                })
                let loginState = await state.then( res=> { return res } )

                if(loginState!==undefined && loginState!==null && loginState==='connected') {
                    document.getElementById('LODS').checked = true
                    createRecommendersFile(this.state.userUri, true, false, false)
                    clearInterval(interval)
                }
            }, 1000);
        }
        catch(err){
            console.log(err);
        }
    }

    chooseSimCRecommender(){
        try{
            var storage = new CrossStorageClient('http://localhost:5001/BooksRecommender/');
            console.log('raaanoooo rahiiii dayra chennoufaaaaa')
            var interval = setInterval(async () => {
                let state = storage.onConnect().then(function() {
                    return storage.get('loginState');
                })['catch'](function(err) {
                    console.log(err);
                })
                let loginState = await state.then( res=> { return res } )

                if(loginState!==undefined && loginState!==null && loginState==='connected') {
                    document.getElementById('SimC').checked = true
                    createRecommendersFile(this.state.userUri, false, true, false)
                    clearInterval(interval)
                }
            }, 1000);
        }
        catch(err){
            console.log(err);
        }
    }

    chooseSimPRecommender(){
        try{
            console.log("aw yedkhol ")
            var storage = new CrossStorageClient('http://localhost:5002/BooksRecommender/');

            var interval = setInterval(async () => {
                let state = storage.onConnect().then(function() {
                    return storage.get('loginState');
                })['catch'](function(err) {
                    console.log(err);
                })
                let loginState = await state.then( res=> { return res } )

                console.log("loginState : " + loginState) 

                if(loginState!==undefined && loginState!==null && loginState==='connected') {
                    document.getElementById('SimP').checked = true
                    await createRecommendersFile(this.state.userUri, false, false, true)
                    clearInterval(interval)
                }
            }, 1000);
        }
        catch(err){
            console.log(err);
        }
    }

    commentHandleChange(event){
        this.setState({commentField : event.target.value}) 
    }

    submitComment(event){
        event.preventDefault();
        var txt = [this.state.commentField]
        if(txt!==''){
            var d = new Date();
            var myRe = new RegExp('https:\\/\\/(.+?)\\.')
            var myArray = myRe.exec(this.state.userUri);
            let username = myArray[1]

            console.log(username)

            var comment={
                image: userImage,
                name: username,
                date: d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear(),
                comment: txt
            }   
            var temp = this.state.users1
            temp.push(comment)
            this.setState({ users1: temp })
            document.getElementsByClassName('RSP-textField')[0].value = "";
            this.setState({ commentField: '' })
        }
    }

    render(){
        return(
            <div className="container">

                <div className="RSP-title">
                    <Link to='/'> <button><img /></button> </Link>
                    <h2>Recommender System Providers Marketplace</h2>
                </div>

                <div className="RSP-availableTitle">
                    <h2>Available products</h2>
                    <p>The following list contains the currently available recommender system providers</p>
                </div>

                <div className="RSP-cardsContainer">
                    <div className="RSP-cardContainer">
                        <div className="card">
                            <div className="cardBody">
                                <h4 className="cardTitle">Recommender system based LODS</h4>
                                <p className="cardText">
                                    The LODS Recommender System operates on ressources using a similarity measure that combines multiple 
                                    sub-measures. This measure is called The <i>Linked Open Data Similarity measure</i> (LODS). 
                                </p>  
                                <a href="http://localhost:5000/BooksRecommender/" target="__blank" className="btnChoice" onClick={this.chooseLodsRecommender.bind(this)} >Choose</a>
                                <label className="choice">
                                     RS provider choosed
                                    <input type="radio" id="LODS" name="RSproviders" ref="1" onChange={this.handleChange} disabled />
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                        </div>   

                        <div className="RSP-feedBack">
                            <div className="RSP-text">
                                <form method="get" onSubmit={this.submitComment.bind(this)} >
                                    <input type='text' placeholder='Add a comment...' className='RSP-textField' name='comment' maxLength="105" onChange={this.commentHandleChange.bind(this)} />
                                    <input type='submit' value='Post' className='RSP-textButton' />
                                </form>
                            </div>
                            <div className="RSP-comments">
                                {
                                    this.state.users1.map((u)=>{
                                        return(
                                            <div key={Math.floor(Math.random() * 999999999)} className="RSP-comment">
                                                <img src={u.image} />
                                                <div>
                                                    <div className="RSP-userName">{u.name}</div>
                                                    <div className="RSP-commentDate">{u.date}</div>
                                                    <div className="RSP-userComment">{u.comment}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="RSP-numbers">
                                <div className="RSP-commentNumbersIcons"><img src={commentsIcon} /></div>
                                <div className="RSP-commentNumbers">{this.state.users1.length} comments</div>
                                <span className="RSP-used"> Provider used by 334 people</span>
                            </div>
                        </div>
                    </div>

                    
                    <div className="RSP-cardContainer">

                        <div className="card">
                            <div className="cardBody">
                                <h4 className="cardTitle">Recommender system based on categories similarity</h4>
                                <p className="cardText">The <i>Categories-based similarity measure</i> (SIMC) operates on classification schemata used to categorize resources. </p>
                                <a href="http://localhost:5001/BooksRecommender/" target="__blank" className="btnChoice" onClick={this.chooseSimCRecommender.bind(this)}>Choose</a> 
                                <label className="choice">
                                    RS provider choosed
                                    <input type="radio" id="SimC" name="RSproviders" ref="2" onChange={this.handleChange} disabled  />
                                    <span className="checkmark"></span>
                                </label>    
                            </div>
                        </div> 

                        <div className="RSP-feedBack">
                            <div className="RSP-text">
                                <form method="get" onSubmit={this.submitComment.bind(this)} >
                                    <input type='text' placeholder='Add a comment...' className='RSP-textField' name='comment' maxLength="105" onChange={this.commentHandleChange.bind(this)} />
                                    <input type='submit' value='Post' className='RSP-textButton' />
                                </form>
                            </div>
                            <div className="RSP-comments">
                                {
                                    this.state.users2.map((u)=>{
                                        return(
                                            <div key={Math.floor(Math.random() * 999999999)} className="RSP-comment">
                                                <img src={u.image} />
                                                <div>
                                                    <div className="RSP-userName">{u.name}</div>
                                                    <div className="RSP-commentDate">{u.date}</div>
                                                    <div className="RSP-userComment">{u.comment}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="RSP-numbers">
                                <div className="RSP-commentNumbersIcons"><img src={commentsIcon} /></div>
                                <div className="RSP-commentNumbers">{this.state.users2.length} comments</div>
                                <span className="RSP-used"> Provider used by 284 people</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="RSP-cardContainer">

                        <div className="card">
                            <div className="cardBody">
                                <h4 className="cardTitle">Recommender system based on properties similarity</h4>
                                <p className="cardText"> The <i>Properties-based similarity measure</i> (SIMP) uses ingoing and outgoing properties 
                                                         of a compared resource in the <i>DBpedia Data Cloud</i>. </p>
                                <a href="http://localhost:5002/BooksRecommender/" target="__blank" className="btnChoice" maxLength="105" onClick={this.chooseSimPRecommender.bind(this)}>Choose</a> 
                                <label className="choice">
                                    RS provider choosed
                                    <input type="radio" id="SimP" name="RSproviders" ref="2" onChange={this.handleChange} disabled  />
                                    <span className="checkmark"></span>
                                </label>    
                            </div>
                        </div> 

                        <div className="RSP-feedBack">
                            <div className="RSP-text">
                                <form method="get" onSubmit={this.submitComment.bind(this)} >
                                    <input type='text' placeholder='Add a comment...' className='RSP-textField' name='comment' onChange={this.commentHandleChange.bind(this)} />
                                    <input type='submit' value='Post' className='RSP-textButton' />
                                </form>
                            </div>
                            <div className="RSP-comments">
                                {
                                    this.state.users3.map((u)=>{
                                        return(
                                            <div key={Math.floor(Math.random() * 999999999)} className="RSP-comment">
                                                <img src={u.image} />
                                                <div>
                                                    <div className="RSP-userName">{u.name}</div>
                                                    <div className="RSP-commentDate">{u.date}</div>
                                                    <div className="RSP-userComment">{u.comment}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="RSP-numbers">
                                <div className="RSP-commentNumbersIcons"><img src={commentsIcon} /></div>
                                <div className="RSP-commentNumbers">{this.state.users3.length} comments</div>
                                <span className="RSP-used"> Provider used by 24 people</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="RSP-footer">
                    <h3>Recommender System Providers Marketplace</h3>
                    <p> <a>Terms and Conditions</a>   <a>Ads Based on Your Interests</a>    <a>Cookies</a>    <a>© 1996-2020, rspm.com, Inc. or its affiliates.</a> </p>
                </div>
                <ToastContainer />
            </div>
        );
    }
}
export default Cards;