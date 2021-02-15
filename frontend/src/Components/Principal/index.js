import React  from 'react'
import './Principal.scss'
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import About from './About'
import SideBar from './SideBar'
import loader from '../../Assets/oval.svg'
import Welcome from '../Welcome';

class Principal extends React.Component {

    constructor() {
        super()
        this.state = {
            booksToRecommend: [],
            loading: "true",
            userUri: '',
            logout: false
        }
    }

    async componentDidMount(){
        this.setState({ loading: false })
    }

    async logout(){
        window.localStorage.clear()
        document.cookie = await "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        await this.setState({ logout: true })
    }

    renderPrincipal(){
        if(this.state.loading) {
            return (
                <div className="Principal-content-loading">
                    <img src={loader} style={{marginTop: '200px', marginLeft: '535px'}}/>
                </div>
            )
        }
        else{
            return(
                <Switch>
                    <SideBar />
                </Switch>
            )
        }
    }

    render(){
        if(this.state.logout) return <Welcome logout={true} />
        else
            return(
                <div>
                    <div className="Principal-wrapper">
                        <Router>
                            <Header />
                            {this.renderPrincipal()}
                            <button className='Principal-logout' onClick={this.logout.bind(this)}><img /></button>
                        </Router>
                    </div>
                </div>
            )
    }
}
export default Principal