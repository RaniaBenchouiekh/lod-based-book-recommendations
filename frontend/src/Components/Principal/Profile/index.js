import React from 'react'
import './profile.scss'
import emailIcon from '../../../Assets/emailIcon.png'
import birthdayIcon from '../../../Assets/birthdayIcon.png'
import genderIcon from '../../../Assets/genderIcon.png'
import genresIcon from '../../../Assets/genresIcon.png'
import { webidToUri, readInfoPerso, removeInfoPerso, createInfoPersoFile, readGenresFile, createGenresFile } from '../../Solid/Communication'
import auth from 'solid-auth-client'
import loader from '../../../Assets/oval.svg'
import defaultImage from '../../../Assets/user.png'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { errorToast, succesToast } from '../../Toast/ToastMethods'


class Profile extends React.Component{
    constructor(){
        super()
        this.state={
            card: null,
            loading: true,
            image:'',
            userUri:'',
            firstName: '',
            lastName: '',
            gender: '',
            email: '',
            birthday: '',
            genresTable: [],
            genres: [],
            allGenres:["islamic","art","biography","buisness","children","christian","classics","cookbooks","crime",
                       "ebooks","fantasy","fiction","graphicNovels","historicalFiction","history","horror",
                       "humorComedy","manga","music","mystery","paranormal","philosophy","poetry","psycology",
                       "religion","romance","science","scienceFiction","sports","travel","developement","fairyTale",
                       "fanFiction","legend"," magicRealism","metaFiction"," mythology","mythopoeia","pictureBook",
                       "realisticFiction"," shortStory","suspenseThriller","swashbuckler"," tallTale","theologicalFiction",
                       "western"," essay","journalism","memoir","referenceBook","speech","textbook","adventure","education",
                       "experimental","mathematical","tragedy","urban","autograph"," diariesJournals","law","letter","manuscript"],
            allGenresSelect: '',
            userGenresSelect: '',
            cnxError: false
        }
        this.submitModification = this.submitModification.bind(this)
        this.enableModification = this.enableModification.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    enableModification(event){
        document.getElementsByClassName('Profile-genreFields')[0].style.display='none'
        document.getElementsByClassName('Profile-modificationFields')[0].style.display='block'
        document.getElementById("firstName").focus();
    }

    async submitModification(event){    
        event.preventDefault();
        try{
            await removeInfoPerso(this.state.userUri) 

            let uri = this.state.userUri
            let fn = this.state.firstName 
            let ln = this.state.lastName
            let email = this.state.email
            let birthday = this.state.birthday
            let gender = this.state.gender==="" ? "male" : this.state.gender
        
            await createInfoPersoFile(uri, fn, ln, email, birthday, gender)
            succesToast("Save succeded")

            let card1={
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "email": this.state.email,
                "birthday": this.state.birthday,
                "gender": this.state.gender==="" ? "male" : this.state.gender,
            }
            await this.setState({ card: card1 })
        }
        catch(err){
            console.log(err);
        }
    }

    handleChange(evt){
        this.setState({ [evt.target.name]: evt.target.value });
    }
    
    async componentDidMount(){
        try{
            this.setState({ image: defaultImage })

            let session = await auth.currentSession();
            let uri = webidToUri(session.webId)
            this.setState({ userUri: uri })

            try{
                //Test connexion
                await auth.fetch(session.webId)
            }catch(err){
                this.setState({ cnxError: true })
            }

            //await createInfoPersoFile(uri, "rano", "bech", "rano@gmail.com", "11/07/1996", "female")

            //Test read card file
            var card1 = await readInfoPerso(uri)
            if(card1.image!=='none') this.setState({ image: card1.image })

            //Read genres file 
            var genres= await readGenresFile(uri)
            
            if(genres!=='none') {
                
                this.setState({genresTable: genres})

                //getAllGenres minus userGenres
                let tempAllGenres=[]
                this.state.allGenres.map(genre=>{
                    if(!genres.includes(genre)) tempAllGenres.push(genre)
                })
                this.setState({allGenres: tempAllGenres})

                //Add it in a String
                let genreString=''
                genres.map( genre => {
                    genreString = genreString + genre + ', '
                })
                this.setState({ genres: genreString.substring(0,genreString.length-2) })
            }
            console.log(card1)
            await this.setState({card: card1, loading: false})
        }
        catch(err){
            
            console.log(err);
        }
    }

    selectHandleChange(e){
        let {name, value} = e.target;
        this.setState({ [name]: value });
    }

    addClick(){
        let addedGenre = this.state.allGenresSelect

        //remove addedGenre from allGenres
        let arr = this.state.allGenres
        for( var i = 0; i < arr.length; i++){ 
            if ( arr[i] === addedGenre) arr.splice(i, 1); 
        }
        this.setState({ allGenres: arr })

        //add it into genresTable
        arr = this.state.genresTable
        arr.push(addedGenre)
        this.setState({ genresTable: arr })
    }

    removeClick(){
        let removedGenre = this.state.userGenresSelect

        //remove removedGenre from allGenres
        let arr = this.state.genresTable
        for( var i = 0; i < arr.length; i++){ 
            if ( arr[i] === removedGenre) arr.splice(i, 1); 
        }
        this.setState({ genresTable: arr })

        //add it into allGenres
        arr = this.state.allGenres
        arr.push(removedGenre)
        this.setState({ allGenres: arr })
    }

    showModifyGenres(){
        document.getElementsByClassName('Profile-modificationFields')[0].style.display='none'
        document.getElementsByClassName('Profile-genreFields')[0].style.display='block'
    }

    async saveGenresInPod(){
        try{
            await createGenresFile(this.state.userUri, this.state.genresTable)
             //Add it to genres
            let genreString=''
            this.state.genresTable.map( genre => {
                genreString = genreString + genre + ', '
            })
            this.setState({ genres: genreString.substring(0,genreString.length-2) })
            succesToast("Save succeded")

        }catch(err){
            console.log('Error message : ' + err)
        }
    }

    render(){
        if(this.state.cnxError) return <div className="Profile-cnxError"><p>Error in connexion to the pod. Please try to reload the page</p></div>
        else {
            if(this.state.loading){
                return(
                    <div className="Profile-wrapper-loading">
                        <img src={loader} />
                    </div>
                )
            }
            else{
                return(
                <div className="Profile-wrapper">
                    <div className="Profile-card">
                        <div className="Profile-cardInfo">
                            <div className="Profile-webid">{this.state.userUri+"profile/card#me"}</div>
                            <div className="Profile-firstName">{this.state.card.firstName}</div>
                            <div className="Profile-lastName">{this.state.card.lastName}</div>
                            <div className="Profile-devider"></div>
                            <div className="Profile-cardSubInfo">
                                <div className="Profile-email">
                                    <img src={emailIcon} alt="Address icon " className="Profile-icons"/>
                                    {this.state.card.email}
                                </div>
                                <div className="Profile-birthday">
                                    <img src={birthdayIcon} alt="Calendar icon " className="Profile-icons"/>
                                    {this.state.card.birthday}
                                </div>
                                <div className="Profile-gender">
                                    <img src={genderIcon} alt="Gender icon " className="Profile-icons"/>
                                    {this.state.card.gender}
                                </div>
                                <div className="Profile-genresContainer">
                                    <div className="Profile-genres">
                                        <img src={genresIcon} alt="Genres icon " className="Profile-icons"/>
                                        <p>Genres : {this.state.genres}</p>
                                        {
                                            <div className="Profile-genresHoverContainer" >
                                            <p className="Profile-genresHover"> {this.state.genres}. </p>
                                            </div>
                                        }
                                    </div>
                                    <button onClick={this.showModifyGenres.bind(this)}>+ add</button>
                                </div>
                            </div>
                            <button className="Profile-enableModify" onClick={this.enableModification}>Modify</button>
                            <img id="Profile-picture" src = {this.state.image} ></img>
                        </div>
                    </div>
                    <div className="Profile-genreFields">
                        <div className="Profile-allGenres" >
                            <h4>All genres</h4>
                            <div className="Profile-innerGenres">
                                <select id="allGenresSelect" name="allGenresSelect" size="12" onChange={this.selectHandleChange.bind(this)}>
                                    {
                                        this.state.allGenres.map(g => {
                                            return <option key={g} value={g}>{g}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="Profile-genresButtons">
                            <button onClick={this.addClick.bind(this)}>&gt;</button>
                            <button onClick={this.removeClick.bind(this)}>&lt;</button>
                        </div>

                        <div className="Profile-userGenres">
                            <h4>My favorites genres</h4>
                            <div className="Profile-innerGenres">
                                <select id="userGenresSelect" name="userGenresSelect" size="12" onChange={this.selectHandleChange.bind(this)}>
                                    {
                                        this.state.genresTable.map(g => {
                                            return <option key={g} value={g}>{g}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        <div>
                            <span className="Profile-note"><b>Note : </b>Select a genre from the left table to add it to your favorites in the right table.</span>
                            <button className="Profile-submitButton" onClick={this.saveGenresInPod.bind(this)}>Save in pod</button>
                        </div>
                    </div>

                    <div className="Profile-modificationFields">
                                    
                        <h2 className="Profile-modifyLabel">Modify your profile</h2>
                        <div className="Profile-inputWrapper">
                            <form onSubmit={this.submitModification}>
                                <div className="Profile-inputField" >
                                    <label htmlFor="firstName" className="Profile-inputFieldLab"> First Name </label>
                                    <input type='text' id="firstName" className="Profile-inputFieldIn" name="firstName" required placeholder={this.state.card.firstName} onChange={this.handleChange} />
                                </div>
                                
                                <div className="Profile-inputField" >
                                    <label htmlFor="lastName" className="Profile-inputFieldLab"> Last Name </label>
                                    <input type='text' id="lastName" className="Profile-inputFieldIn" name="lastName" required placeholder={this.state.card.lastName} onChange={this.handleChange} />
                                </div>

                                <div className="Profile-inputField">
                                    <label htmlFor="Profile-email" className="Profile-inputFieldLab"> Email </label>
                                    <input type='email' id="Profile-email" className="Profile-inputFieldIn" name="email" required placeholder={this.state.card.email} onChange={this.handleChange} />
                                </div>

                                <div className="Profile-inputField">
                                    <label htmlFor="Profile-birthday" className="Profile-inputFieldLab"> Birthday </label>
                                    <input type='date'  id="Profile-birthday" className="Profile-inputFieldIn" name="birthday" required onChange={this.handleChange} />
                                </div>

                                <div className="Profile-radioArea">
                                    <input className="Profile-radioBox" type="radio" id="male" name="gender" value="male" onChange={this.handleChange} defaultChecked="checked"/>
                                    <label className="Profile-radioLabel" htmlFor="male">Male</label>
                                    <input className="Profile-radioBox" type="radio" id="female" name="gender" value="female" onChange={this.handleChange}/>
                                    <label className="Profile-radioLabel" htmlFor="female">Female</label>

                                    <input type="submit" className="Profile-submitInfoButton" value="Save in pod" />
                                </div>
                            </form>
                        </div> 
                    </div>
                    <ToastContainer />
                </div>
                );
            }
        }
    }
}
export default Profile;