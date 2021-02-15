import React  from 'react'
import './Welcome.scss'
import auth from 'solid-auth-client'
import { AuthButton,Value} from '@solid/react';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../Toast/ToastMethods'
import { createAppFolder, verifyAccess, webidToUri, createAppDataFile, readProfileImage, readAppDataFile } from '../Solid/Communication'
import InfoPerso from "../Steps/InfoPerso";
import { removeSolidFile } from '../Solid/solidMethods'
import defaultImage from '../../Assets/user.png'
import Header from './Header';
import google from '../../Assets/google.png'
import { fromNT } from 'rdflib';
import Principal from '../Principal';

                  
class Welcome extends React.Component {
    constructor(props){
        super(props)
        this.state = { 
            loggedIn : false, 
            infoPerso: false,
            pricipale: false,
            profileImage: '',
            loading: false,
            logout: this.props.logout
        };
    }
    

    interval = setInterval(async () => {
        try{
            if(this.state.logout){
                window.location.reload()
                this.setState({ logout: false })
            }
            else{
                let session = await auth.currentSession()
                if(session!==null) this.setState({loggedIn:true})
                else {
                    this.setState({loggedIn:false})
                }
            }
        }
        catch(err){
            console.log(err);
        }
    }, 1000);


    handleClick = async (event) => {

        var error = false
        this.setState({ loading: true })
        try {

          //Test connexion
          try{
            let session = await auth.currentSession();
            var cnx = await auth.fetch(session.webId);  
          }
          catch(err){
            this.setState({ loading: false })
            errorToast('Connexion error')
            error=true
          }

          if(!error){
            //Test prmissions
            let session = await auth.currentSession();
            let verif = await verifyAccess(session.webId)
            if (!verif) {
                this.setState({ loading: false })
                errorToast('You must check all access modes options in your Solid pod')
                throw new Error('Not enough permissions')
            }

            //Get User image
            this.setState({ profileImage: defaultImage })
            let uri = webidToUri(session.webId)
            var card = await readProfileImage(uri)
            if(card!='none') this.setState({ profileImage: card, profileName: card.firstName })

             
            //Create app folder and file
            await createAppFolder(uri)
            let cnxNbr=0
            try{
                let appData = await readAppDataFile(uri)
                cnxNbr = parseInt(appData.split('%%')[0])
                let firstCnx = appData.split('%%')[1]
                cnxNbr=cnxNbr+1
                await createAppDataFile(uri, cnxNbr, firstCnx)
            }
            catch(err){
                console.log('app data file non existant')
            }

            await removeSolidFile(uri+'/public/SolidMovies/bbeacea0-f819-11ea-be5b-090a19b828e2-recommenders.ttl')
        
            //Continue to next page
            if(cnxNbr===0) this.setState({ infoPerso: true });
            else this.setState({ pricipale: true });

            this.setState({ loading: false })
        }

        }
        catch(err){
            console.log(err);
        }
    }
   
    render() {
        if(this.state.infoPerso) { return (<InfoPerso />) }
        else 
            if(this.state.pricipale) { return (<Principal />) }
            else {
                return (
                    <div className="Welcome-wrapper">
                    
                        {
                            this.state.loggedIn?
                            <Header />
                            :
                            <div className="Welcome-header">
                                {/* 
                                <div className="Welcome-headerContacts">
                                    <a href='https://www.facebook.com/Solid_GoogleBooks-588642671819269/' target='__blank' className="Welcome-headerContactsIcon"><img className="Welcome-fb"/></a>
                                    <a href='https://www.facebook.com/Solid_GoogleBooks-588642671819269/' target='__blank' className="Welcome-headerContactsIcon"><img className="Welcome-insta"/></a>
                                    <a href='https://www.linkedin.com/in/solid-apps-3214661b4/' target='__blank' className="Welcome-headerContactsIcon"><img className="Welcome-in"/></a>
                                    <a href='https://github.com/solidbookapp' target='__blank' className="Welcome-headerContactsIcon"><img className="Welcome-gh"/></a>
                                </div>
                                */}
                                <div id="Welcome-appTitle">
                                    <h3>
                                        <span className='Welcome-solid'>Solid</span> 
                                        <img className='Welcome-googleImg' src={google} />
                                        <span className='Welcome-solid'>Books</span> 
                                    </h3>
                                    <h5>Decentralized Books Plateform</h5>
                                </div>   
                            </div>
                        }

                        {
                            this.state.loggedIn?
                            <button id="Welcome-continueButton" onClick={this.handleClick}>Continue </button> 
                            :
                            null
                        }

                        <div className="Welcome-functions">
                        </div>

                        <div className="Welcome-imageBack">

                        </div>

                        <div className="Welcome-introduction">
                            <h1>The decentralized plateform of <span>Google Books</span></h1>
                            <h4>A decentralized book platform offering the user several advantages such as security and portability by preserving his data in his pod.</h4>
                            <p id="Welcome-loginButton"><AuthButton  popup="popup.html"/></p>
                                {
                                    !this.state.loggedIn ?
                                    <a href="https://solid.github.io/solid-idps/" target="__blank" id="Welcome-Register">Register</a>
                                    : null
                                }
                                {
                                    this.state.loading ?
                                    <img className="Welcome-loader"></img>
                                    : null
                                }
                        </div>
                        
                        <div className="Welcome-fonctionnalities">
                            <div className="Welcome-recomm"><img /></div>
                            <div className="Welcome-search"><img /></div>
                            <div className="Welcome-profileMan"><img /></div>
                            <div className="Welcome-saveRate"><img /></div>

                            <div className="Welcome-recomm-comment"><h4>Get recommendations</h4> <p>The application offers suitable recommendations for the user</p></div>
                            <div className="Welcome-search-comment"><h4>Search books</h4> <p>The user can search for any book by typing a keyword</p></div>
                            <div className="Welcome-profile-comment"><h4>Profile management</h4> <p>The application gives the user the possibility to manage his profile</p></div>
                            <div className="Welcome-saveRate-comment"><h4>Save and rate books</h4> <p>The user can rate or save any book in his pod</p></div>
                        </div>

                        <footer className="Welcome-footer">
                            <div className="Welcome-footerContacts">
                                <a href='https://www.facebook.com/Solid_GoogleBooks-588642671819269/' className="Welcome-footerContactsIcon"><img className="Welcome-Ffb"/></a>
                                <a href='https://www.facebook.com/Solid_GoogleBooks-588642671819269/' className="Welcome-footerContactsIcon"><img className="Welcome-Finsta"/></a>
                                <a href='https://www.linkedin.com/in/solid-apps-3214661b4/' className="Welcome-footerContactsIcon"><img className="Welcome-Fin"/></a>
                                <a href='https://github.com/solidbookapp' className="Welcome-footerContactsIcon"><img className="Welcome-Fgh"/></a>
                            </div>
                            <p>This application works with <a href="https://inrupt.com/solid">Solid</a></p>
                        </footer>
                            
                        <ToastContainer />
                    </div>
                );
            }
    }
}
export default Welcome