import React,{Component} from 'react';
import auth from 'solid-auth-client'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { errorToast, succesToast } from '../../Toast/ToastMethods'
import ReactTooltip from 'react-tooltip'
import './genres.scss';
import '../InfoPerso/InfoPerso.scss';
import Stepper from 'react-stepper-horizontal'
import { createGenresFile, webidToUri, verifyAccess, readInfoPerso, createSavedBooksFolder, createRatedBooksFolder } from '../../Solid/Communication'
import Ratings from '../Ratings';
import Header from '../Header'


class Genres extends Component{

    state = { showMe: false, checkedGenres: [] };

    constructor () {
    super();
    this.state = {
      islamic:false,art:false,biography:false,buisness:false,children:false,christian:false,classics:false,cookbooks:false,
      crime:false,ebooks:false,fantasy:false,fiction:false,graphicNovels:false,historicalFiction:false,history:false,horror:false,
      humorComedy:false,manga:false,music:false,mystery:false,paranormal:false,philosophy:false,poetry:false,psycology:false,
      religion:false,romance:false,science:false,scienceFiction:false,sports:false,travel:false,developement:false,fairyTale:false,
      fanFiction:false,legend:false, magicRealism:false,metaFiction:false, mythology:false,mythopoeia:false,pictureBook:false,
      realisticFiction:false, shortStory:false,suspenseThriller:false,swashbuckler:false, tallTale:false,theologicalFiction:false,
      western:false, essay:false,journalism:false,memoir:false,referenceBook:false,speech:false,textbook:false,adventure:false, 
      education:false,experimental:false,mathematical:false,tragedy:false,urban:false,autograph:false, diariesJournals:false,
      law:false, letter:false, manuscript:false,
      all:false,
      hide:true, 
      profileImage: '',
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeAll = this.handleChangeAll.bind(this);
  }

  //Click on "Next" button
  handleClick = async (event) => {
    var i
    var arr= []
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
            for(i=1;i<64;i++) { 
                if (this.refs[i].checked) arr.push(this.refs[i].name)
            }
            await this.setState ({checkedGenres: arr}) 

            //Check if he selected at least 3 genres
            if(this.state.checkedGenres.length<1) {
                this.setState({ loading: false })
                errorToast('Select at least one genre')
                throw new Error("Select at least one genre")
            }

            //Test prmissions
            let session = await auth.currentSession();
            let verif = await verifyAccess(session.webId)
            if (!verif){
                this.setState({ loading: false })
                errorToast('You must check all access modes options in your Solid pod')
                throw new Error('not enough permissions') 
            } 

            //save the genres in the pod
            let uri = webidToUri(session.webId)
            await createGenresFile(uri,this.state.checkedGenres) 
            await createSavedBooksFolder(uri)
            await createRatedBooksFolder(uri)
    
            //Continue to next page
            this.setState({ loading: false })
            succesToast(" Save succeded")
            setTimeout(()=>{
                this.setState({ showMe :true });
            },3000)
        }
    }
    catch(err){
        console.log(err);
    }
    
  }

  //Return the genres's states
  handleChange (event) { 
    this.setState({ [event.target.name]: event.target.checked });
  }

  //Check all genres and return the state of the 'select all' option
  handleChangeAll(event) { 
    var i;
    this.setState({ [event.target.name]: event.target.checked });
    if(this.state.hide)
      for(i=1;i<64;i++) {this.refs[i].checked = !this.refs[i].checked;}
    else 
      for(i=1;i<64;i++) {this.refs[i].checked = !this.refs[i].checked;}
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
        return (<Ratings genres={this.state.checkedGenres} />)
    }
    else {

  return (
    <div className="Genres-wrapper">
        <ReactTooltip
            id="allTooltip"
            className="Genres-tooltip"
            place={'bottom'}
            type={'info'}
            multiline={true}
            effect={'float'}
            textColor={'#eae7dc'}
            backgroundColor={'#8e8d8a'}
            delayShow={300}
        />

        <Header />

        <div className="Genres-StepsHeader">
            <Stepper 
             steps={ [
                  {title: 'Insert personal information'},
                  {title: 'Choose genres'}, 
                  {title: 'Rate some books'}
            ] } 
            circleTop= { 5 }
            activeStep={ 1 }
            activeOpacity ={'0.7'} 
            activeColor = { '#bdd1bd' }
            activeTitleColor = { '#bdd1bd' }
            completeColor = { '#3cb35e' }
            completeTitleColor = { '#3cb35e' }
            size={ 30 }
            circleFontSize = { 13 }
            titleFontSize= { 15 }
            completeBarColor= {'#3cb35e' }
            />
        </div>

      <div className ="Genres-formWrapper">
        <div className="Genres-formHeader">
          <h2>Select your favorite genres</h2>
          <p>These genres you select help us find out your taste and what you would like as suggestions</p>
        </div>

        <div className="Genres-checkButton">
          <input type="checkbox" name ="all" id="Genres-checkAllButton" onChange={this.handleChangeAll}/> 
          <label htmlFor="Genres-checkAllButton">Check All</label>
        </div>
        
        <div className="Genres-form1">

            <div className="Genres-checkButton">
            <input type="checkbox" name ="islamic" id="Islamic" ref="1" onChange={this.handleChange}/>  
            <label htmlFor='Islamic'>Islamic</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="art" id="Art" ref="2" onChange={this.handleChange}/> 
            <label htmlFor='Art'>Art</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="biography" id="Biography" ref="3" onChange={this.handleChange}/> 
            <label htmlFor='Biography'>Biography</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name ="buisness" id="Buisness" ref="4"onChange={this.handleChange}/> 
            <label htmlFor='Buisness'>Buisness</label>
            </div>

            <div className="Genres-checkButton">           
            <input type="checkbox" name ="children" id="Children" ref="5"onChange={this.handleChange}/> 
            <label htmlFor='Children'>Children</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="ItBooks" id="ItBooks" ref="6"onChange={this.handleChange}/> 
            <label htmlFor='ItBooks'>ItBooks</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name ="classics" id="Classics" ref="7"onChange={this.handleChange}/> 
            <label htmlFor='Classics'>Classics</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox"name ="cookbooks" id="Cookbooks" ref="8"onChange={this.handleChange} /> 
            <label htmlFor='Cookbooks'>Cookbooks</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox"name ="crime" id="Crime" ref="9"onChange={this.handleChange}/> 
            <label htmlFor='Crime'>Crime</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="ebooks" id="Ebooks" ref="10"onChange={this.handleChange}/> 
            <label htmlFor='Ebooks'>Ebooks</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="fantasy" id="Fantasy" ref="11"onChange={this.handleChange}/> 
            <label htmlFor='Fantasy'>Fantasy</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="fiction" id="Fiction" ref="12"onChange={this.handleChange}/> 
            <label htmlFor='Fiction'>Fiction</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="graphicNovels" id="GraphicNovels" ref="13"onChange={this.handleChange}/> 
            <label htmlFor='GraphicNovels'>Graphic Novels</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="historicalFiction" id="HistoricalFiction" ref="14"onChange={this.handleChange}/> 
            <label htmlFor='HistoricalFiction'>Historical Fiction</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="history" id="History" ref="15" onChange={this.handleChange}/> 
            <label htmlFor='History'>History</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="horror" id="Horror" ref="16" onChange={this.handleChange}/> 
            <label htmlFor='Horror'>Horror</label>
            </div>

            <div className="Genres-checkButton" >
            <input type="checkbox" name="humorComedy" id="Humor_Comedy" ref="17"onChange={this.handleChange}/> 
            <label htmlFor='Humor_Comedy'>Humor_Comedy</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="manga" id="Manga" ref="18" onChange={this.handleChange}/> 
            <label htmlFor='Manga'>Manga</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="music" id="Music" ref="19"onChange={this.handleChange}/> 
            <label htmlFor='Music'>Music</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="mystery" id="Mystery" ref="20"onChange={this.handleChange}/> 
            <label htmlFor='Mystery'>Mystery</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox"name="paranormal" id="Paranormal" ref="21"onChange={this.handleChange}/> 
            <label htmlFor='Paranormal'>Paranormal</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="philosophy" id="Philosophy" ref="22" onChange={this.handleChange}/> 
            <label htmlFor='Philosophy'>Philosophy</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="poetry" id="Poetry" ref="23"onChange={this.handleChange}/> 
            <label htmlFor='Poetry'>Poetry</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="psycology" id="Psycology" ref="24"onChange={this.handleChange}/> 
            <label htmlFor='Psycology'>Psycology</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="religion" id="Religion" ref="25"onChange={this.handleChange}/> 
            <label htmlFor='Religion'>Religion</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="romance" id="Romance" ref="26"onChange={this.handleChange}/> 
            <label htmlFor='Romance'>Romance</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="science" id="Science" ref="27"onChange={this.handleChange}/> 
            <label htmlFor='Science'>Science</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="scienceFiction"id="ScienceFicition" ref="28"onChange={this.handleChange}/> 
            <label htmlFor='ScienceFicition'>Science Ficition</label>
            </div>

            <div className="Genres-checkButton" >
            <input type="checkbox" name="sports" id="Sports" ref="29"onChange={this.handleChange}/> 
            <label htmlFor='Sports'>Sports</label>  
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="travel" id="Travel" ref="30"onChange={this.handleChange}/> 
            <label htmlFor='Travel'>Travel</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="developement" id="Developement" ref="31"onChange={this.handleChange}/> 
            <label htmlFor='Developement'>Developement</label>
            </div>

            <div className="Genres-checkButton">
            <input type="checkbox" name="fairyTale" id="FairyTale" ref="32"onChange={this.handleChange}/> 
            <label htmlFor='FairyTale'>Fairy tale</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="fanFiction" id="FanFiction" ref="33"onChange={this.handleChange}/> 
                <label htmlFor='FanFiction'>Fan fiction </label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="legend" id="Legend" ref="34"onChange={this.handleChange}/>   
                <label htmlFor='Legend'>Legend</label>
            </div>
            
            <div className="Genres-checkButton">
                <input type="checkbox" name="magicRealism" id="MagicalRealism" ref="35"onChange={this.handleChange}/>
                <label htmlFor='MagicalRealism'>Magical realism</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="metaFiction" id="MetaFiction" ref="36"onChange={this.handleChange}/> 
                <label htmlFor='MetaFiction'>Meta fiction </label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="mythology" id="Mythology" ref="37"onChange={this.handleChange}/>   
                <label htmlFor='Mythology'>Mythology</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="mythopoeia" id="Mythopoeia" ref="38" onChange={this.handleChange}/>   
                <label htmlFor='Mythopoeia'>Mythopoeia</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="pictureBook" id="PictureBook" ref="39" onChange={this.handleChange}/> 
                <label htmlFor='PictureBook'>Picture book</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="realisticFiction" id="RealisticFiction" ref="40" onChange={this.handleChange}/>
                <label htmlFor='RealisticFiction'>Realistic fiction</label>   
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="shortStory" id="ShortStory" ref="41" onChange={this.handleChange}/> 
                <label htmlFor='ShortStory'>Short story</label>  
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="suspenseThriller" id="Suspense_Thriller" ref="42" onChange={this.handleChange}/>  
                <label htmlFor='Suspense_Thriller'>Suspense/Thriller</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="swashbuckler" id="Swashbuckler" ref="43"onChange={this.handleChange}/>  
                <label htmlFor='Swashbuckler'>Swashbuckler</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="tallTale" id="TallTale" ref="44" onChange={this.handleChange}/>   
                <label htmlFor='TallTale'>Tall tale</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="theologicalFiction" id="TheologicalFiction" ref="45"onChange={this.handleChange}/> 
                <label htmlFor='TheologicalFiction'>Theological fiction</label>  
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="western" id="Western" ref="46"onChange={this.handleChange}/>   
                <label htmlFor='Western'>Western</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="essay" id="Essay" ref="47"onChange={this.handleChange}/>  
                <label htmlFor='Essay'>Essay</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="journalism"id="Journalism" ref="48"onChange={this.handleChange}/>   
                <label htmlFor='Journalism'>Journalism</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="memoir" id="Memoir" ref="49"onChange={this.handleChange}/>   
                <label htmlFor='Memoir'>Memoir</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="referenceBook" id="ReferenceBook" ref="50"onChange={this.handleChange}/>  
                <label htmlFor='ReferenceBook'>Reference book</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="speech" id="Speech" ref="51"onChange={this.handleChange}/>  
                <label htmlFor='Speech'>Speech</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="textbook" id="Textbook" ref="52"onChange={this.handleChange}/>  
                <label htmlFor='Textbook'>Textbook</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="adventure" id="Adventure" ref="53"onChange={this.handleChange}/>  
                <label htmlFor='Adventure'>Adventure</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="education" id="Education" ref="54"onChange={this.handleChange}/> 
                <label htmlFor='Education'>Education</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="experimental" id="Experimental" ref="55"onChange={this.handleChange}/>  
                <label htmlFor='Experimental'>Experimental</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="mathematical" id="Mathematical" ref="56"onChange={this.handleChange}/>  
                <label htmlFor='Mathematical'>Mathematical</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="tragedy" id="Tragedy" ref="57"onChange={this.handleChange}/>  
                <label htmlFor='Tragedy'>Tragedy</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="urban" id="Urban" ref="58"onChange={this.handleChange}/>  
                <label htmlFor='Urban'>Urban</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="autograph" id="Autograph" ref="59"onChange={this.handleChange}/>  
                <label htmlFor='Autograph'>Autograph</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="diariesJournals" id="Diaries_Journals" ref="60"onChange={this.handleChange}/>  
                <label htmlFor='Diaries_Journals'>Diaries/Journals</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="law" id="Law" ref="61"onChange={this.handleChange}/>  
                <label htmlFor='Law'>Law</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="letter" id="Letter" ref="62"onChange={this.handleChange}/>  
                <label htmlFor='Letter'>Letter</label>
            </div>

            <div className="Genres-checkButton">
                <input type="checkbox" name="manuscript" id="Manuscript" ref="63"onChange={this.handleChange}/>  
                <label htmlFor='Manuscript'>Manuscript</label>
            </div>
            
            </div>
      
        </div>

        <div className="Genres-imageBack">

        </div>
        
        <a data-for="allTooltip" data-tip="Next step" data-iscapture="true">
            <div className="Genres-continueButton">
                <button onClick={this.handleClick}>Continue</button>
            </div>
        </a>

        {
            this.state.loading ?
            <img className="Genres-loader"></img>
            : null
        }

        <ToastContainer />
    </div>
  );
    }
}}

export default Genres;