import React  from 'react'
import auth from 'solid-auth-client'
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../../Toast/ToastMethods'
import {Value} from '@solid/react';
import { webidToUri, readInfoPerso } from '../../Solid/Communication'
import defaultImage from '../../../Assets/user.png'
import './Header.scss'
import { Link } from 'react-router-dom'
import google from '../../../Assets/google.png'


                  
export default class Header extends React.Component {
    state = {
        profileImage: ''
    };

    
    componentDidMount = async (event) => {

        try {
          //Get User image
          this.setState({ profileImage: defaultImage })
          let session = await auth.currentSession();
          let uri = webidToUri(session.webId)
          var card = await readInfoPerso(uri)
          if(card.image!='none') this.setState({ profileImage: card.image })
        }
        catch(err){
            console.log(err);
        }
    }
   
    render() {
            return (
                    <div>
                        <div className="Header-header">
                            <div className="Header-headerContacts">
                                <a href='https://www.facebook.com/Solid_GoogleBooks-588642671819269/' target='__blank' className="Header-headerContactsIcon"><img className="Header-fb"/></a>
                                <a href='https://www.facebook.com/Solid_GoogleBooks-588642671819269/' target='__blank' className="Header-headerContactsIcon"><img className="Header-insta"/></a>
                                <a href='https://www.linkedin.com/in/solid-apps-3214661b4/' target='__blank' className="Header-headerContactsIcon"><img className="Header-in"/></a>
                                <a href='https://github.com/solidbookapp' target='__blank' className="Header-headerContactsIcon"><img className="Header-gh"/></a>
                            </div>
                            <div id="Header-appTitle">
                                <Link to="/">
                                    <h3>
                                        <span className='Header-solid'>Solid</span> 
                                        <img className='Header-googleImg' src={google} />
                                        <span className='Header-solid'>Books</span>  
                                    </h3>
                                    <h5>Decentralized Books Plateform</h5>
                                </Link>
                            </div>
                            <div className='Header-profile'>
                                <Link to='/Profile'>
                                    <img className='Header-profileImage' src={this.state.profileImage} />
                                    <p className="Header-profileName"><Value src="user.name"/></p>
                                </Link>
                            </div>
                        </div>
                        <div className="Header-navBar">
                            <ul>
                                <Link to='/' ><li>Home</li></Link>
                                <Link to='/Profile' ><li>Profile</li></Link>
                                <Link to='/About' ><li>About</li></Link>                                
                            </ul>
                        </div>
                    </div>
            )
        }
}
