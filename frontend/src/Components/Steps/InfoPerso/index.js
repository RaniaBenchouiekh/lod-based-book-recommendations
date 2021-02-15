import React  from "react";
import auth from 'solid-auth-client'
import Stepper from 'react-stepper-horizontal'
import { errorToast, succesToast } from '../../Toast/ToastMethods'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from 'react-tooltip'
import './InfoPerso.scss';
import { createInfoPersoFile, webidToUri, verifyAccess,
         readInfoPerso } from '../../Solid/Communication'
import Genres from "../Genres";
import Header from "../Header";


class InfoPerso extends React.Component {
  state = { showMe: false };

  constructor () {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      gender: '',
      email: '',
      Birthday: '', 
      profileImage: '',
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick = async (event) => {
    event.preventDefault();
    var error = false
    this.setState({ loading:true })

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
          //Test permissions
          let session = await auth.currentSession();
          let verif = await verifyAccess(session.webId)
          if (!verif){
              this.setState({ loading: false })
              errorToast('You must check all access modes options in your Solid pod')
              throw new Error('Not enough permissions')
          } 
          
          //save user info in the pod
          let uri = webidToUri(session.webId)
          let fn = this.state.firstName 
          let ln = this.state.lastName
          let email = this.state.email
          let birthday = this.state.Birthday
          let gender = this.state.gender
          await createInfoPersoFile(uri, fn, ln, email, birthday, gender) 

          //Continue to next page
          this.setState({loading:false})
          succesToast(" Save succeded")
          setTimeout(()=>{
            this.setState({ showMe : true });
          },3000)
        }
    }
    catch(err){
        console.log(err);
    }
  }

  handleChange = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  async componentDidMount(){
    try{
        let session = await auth.currentSession();
        //Get the photo of the user's pod
        let uri = webidToUri(session.webId)
        var card = await readInfoPerso(uri)
        if(card.image!=='none') this.setState({ profileImage: card.image })
    }
    catch(err){
      console.log(err);
    }
  }

  render() {
    
    if(this.state.showMe) { 
      return (<Genres />)
    }
    else {
      
      return (
        <div className="PersoInfo-wrapper">
          <ReactTooltip
            id="allTooltip"
            className="InfoPerso-tooltip"
            place={'bottom'}
            type={'info'}
            multiline={true}
            effect={'float'}
            textColor={'#eae7dc'}
            backgroundColor={'#8e8d8a'}
            delayShow={300}
          />
          
          <Header />

          <div className="PersoInfo-StepsHeader">
            <Stepper 
            steps={ [
              {title: 'Insert personal information'}, 
              {title: 'Choose genres'}, 
              {title: 'Rate some books'}
            ] } 
            circleTop= { 5 }
            activeStep={ 0 }
            activeOpacity ={0.7} 
            activeColor = { '#bdd1bd' }
            activeTitleColor = { '#bdd1bd' }
            completeColor = { '#f33e1b' }
            completeTitleColor = { '#f33e1b' }
            size={ 30 }
            circleFontSize = { 13 }
            titleFontSize= { 15 }
            completeBarColor= {'#f33e1b' }
            />
          </div>

          <form onSubmit={this.handleClick}>

          <div className="PersoInfo-formWrapper">
            
              <h1 id="PersoInfo-label"> Personal Information </h1>
              <div className="PersoInfo-inputWrapper">
                <div className="PersoInfo-inputField" >
                  <input type='text' id="firstName" className="PersoInfo-inputFieldIn" name="firstName" required  onChange={this.handleChange} />
                  <label htmlFor="firstName" className="PersoInfo-inputFieldLab"> First Name </label>
                </div>
              
                <div className="PersoInfo-inputField" >
                  <input type='text' id="lastName" className="PersoInfo-inputFieldIn" name="lastName" required onChange={this.handleChange} />
                  <label htmlFor="lastName" className="PersoInfo-inputFieldLab"> Last Name </label>
                </div>

                <div className="PersoInfo-mailField">
                  <input type='email' id="PersoInfo-email" className="PersoInfo-inputFieldIn" name="email" required onChange={this.handleChange} />
                  <label htmlFor="PersoInfo-email" className="PersoInfo-inputFieldLab"> E-mail </label>
                </div>

                <div id="PersoInfo-birthday">
                  <label htmlFor="PersoInfo-birthday" className="PersoInfo-inputFieldLab"> Birthday </label>
                </div>

                <div className="PersoInfo-inputField">
                  <input type='date'  id="PersoInfo-birthday" className="PersoInfo-inputFieldIn" name="Birthday" required onChange={this.handleChange} />
                </div>
                
                <input type="radio" id="male" name="gender" value="male" onChange={this.handleChange}/>
                <label className="PersoInfo-radioLabel" htmlFor="male">Male</label>
                <input type="radio" id="female" name="gender" value="female" onChange={this.handleChange}/>
                <label className="PersoInfo-radioLabel" htmlFor="female">Female</label>

              </div>
          
          </div>

          <div className="PersoInfo-imageBack">

          </div>

          <a data-for="allTooltip" data-tip="Next step" data-iscapture="true">
            <div className="PersoInfo-continueButton">
              <input type="submit" name="Next" value="Continue"/>
            </div>
          </a>

          {
              this.state.loading ?
              <img className="PersoInfo-loader"></img>
              : null
          }

          </form>

          <ToastContainer />

        </div>
      );
   }
  }
}
export default InfoPerso;