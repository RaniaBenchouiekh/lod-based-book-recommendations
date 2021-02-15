import React  from 'react'
import './About.scss'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { errorToast, succesToast } from '../../Toast/ToastMethods'

class About extends React.Component {
    state = {};
    componentDidMount(){}
    render(){
        return(
            <div className="About-wrapper">
                <div className="About-searchWrapper">
                    <h2>About</h2>
                </div>
                <div className="About-desc">
                    <h3>What is Solid Google Books ? what does it offer ?</h3>
                    <p>Solid Google Books is a new project. This project aims to radically change the way items are recommended today, resulting in true data ownership as well as improved privacy.</p>
                    <p>Solid Google Books is a decentralized social application based on Linked Data principles, its main purpose is to offer book recommendations based on the user's preferences which are localy stored in his personal storage space. It uses a new technology called Solid which is a technology, like the Web, but a new level of standard which adds to the existing protocols to make it more powerful, particularly to empower individuals at home and at work.</p>
                    <p>Solid provides for the first time a single global logon system, so that when you log into any web site, instead of having to log in with the usual 'f' and 'g', etc, blue buttons, and then be tracked by Facebook, Google, or some other large social network, instead you can log in with any Solid provider you trust, and that won't track you.</p>
                    <p>When Solid Google Books starts, it just stores all the data it needs to work in your pod. It doesn't store the data itself at some computer run by the developers. So by default you control all the data in your Solid pod. This is a massive improvement to your privacy.</p>
                    <p>Our app doesn't just store the data in your pod any old way. It uses Solid standard formats. This means that you and the people you work with can actually use many different apps – at the same time even – to do stuff. </p>
                    <p>At a glance, here is what Solid offers...</p>
                </div>
                <div className="About-functionalitiesDetails">
                    <div className="About-welcome">
                        <h4>1. The welcome page</h4>
                        <p>When the user visits the application, the first page he will encounter will contain the following :</p>
                        <div className="About-login"></div>
                        <div className="About-logout"></div>
                    </div>
                    <div className="About-steps">
                        <h4>2. The inscription steps</h4>
                        <p>For his first connection, the user will have to go through the following steps :</p>
                        <h5 className="About-infoPersoTitle">2.1. Personal informations</h5>
                        <h5 className="About-genresTitle">2.2. Favorite genres</h5>
                        <div className="About-infoPerso"></div>
                        <div className="About-genres"></div>
                        <h5 className="About-ratingsTitle">2.3. Favorite books</h5>
                        <div className="About-ratings"></div>
                        <div className="About-searchRatings"></div>
                    </div>
                    <div className="About-principal">
                        <h4>3. The principal page</h4>
                        <p>Once the user is connected to the application, he will be able to go through multiple funtionnalities as follows :</p>
                        <h5 className="About-homeTitle">3.1. Choosing the recommender system</h5>
                        <div className="About-home"></div>
                        <div className="About-marketplace"></div>
                        <h5 className="About-recomendationsTitle">3.2. Home page (book recommendations and search books)</h5>
                        <div className="About-recommendations"></div>
                        <div className="About-searchHome"></div>
                        <h5 className="About-savedTitle">3.3. Saved books</h5>
                        <h5 className="About-ratedTitle">3.4. Rated books</h5>
                        <div className="About-saved"></div>
                        <div className="About-rated"></div>
                        <h5 className="About-profileTitle">3.5. Profile management</h5>
                        <div className="About-profile"></div>
                        <div className="About-modifyProfile"></div>
                        <div className="About-modifyGenres"></div>
                    </div>
                </div>
                
            </div>
        )
    }
}
export default About