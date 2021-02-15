import React  from 'react'
import './Welcome.scss'
import auth from 'solid-auth-client'
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../Toast/ToastMethods'
import {Value} from '@solid/react';
import { webidToUri, readProfileImage, createAppDataFile, readAppDataFile } from '../Solid/Communication'
import defaultImage from '../../Assets/user.png'
import google from '../../Assets/google.png'


                  
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
          if(card!='none') this.setState({ profileImage: card })
        }
        catch(err){
            console.log(err);
        }
    }
   
    render() {
            return (
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
                        <div className='Welcome-profile'>
                            <img className='Welcome-profileImage' src={this.state.profileImage} />
                            <p className="Welcome-profileName"><Value src="user.name"/></p>
                        </div>
                    </div>
            )
        }
}
