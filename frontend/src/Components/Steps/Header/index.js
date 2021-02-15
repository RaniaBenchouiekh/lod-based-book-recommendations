import React  from 'react'
import auth from 'solid-auth-client'
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../../Toast/ToastMethods'
import {Value} from '@solid/react';
import { webidToUri, readProfileImage } from '../../Solid/Communication'
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
          var card = await readProfileImage(uri)
          if(card!=='none') this.setState({ profileImage: card })

        }
        catch(err){
            console.log(err);
        }
    }
   
    render() {
            return (
                    <div>
                        <div className="stepsHeader-header">
                            <div className="stepsHeader-headerContacts">
                                <a href='https://www.facebook.com/Solid_GoogleBooks-588642671819269/' target='__blank' className="stepsHeader-headerContactsIcon"><img className="stepsHeader-fb"/></a>
                                <a href='https://www.facebook.com/Solid_GoogleBooks-588642671819269/' target='__blank' className="stepsHeader-headerContactsIcon"><img className="stepsHeader-insta"/></a>
                                <a href='https://www.linkedin.com/in/solid-apps-3214661b4/' target='__blank' className="stepsHeader-headerContactsIcon"><img className="stepsHeader-in"/></a>
                                <a href='https://github.com/solidbookapp' target='__blank' className="stepsHeader-headerContactsIcon"><img className="stepsHeader-gh"/></a>
                            </div>
                            <div id="stepsHeader-appTitle">
                                <h3>
                                    <span className='stepsHeader-solid'>Solid</span> 
                                    <img className='stepsHeader-googleImg' src={google} />
                                    <span className='stepsHeader-solid'>Books</span> 
                                </h3>
                                <h5>Decentralized Books Plateform</h5>
                            </div>
                            <div className='stepsHeader-profile'>
                                <img className='stepsHeader-profileImage' src={this.state.profileImage} />
                                <p className="stepsHeader-profileName"><Value src="user.name"/></p>
                            </div>
                        </div>
                    </div>
            )
        }
}
