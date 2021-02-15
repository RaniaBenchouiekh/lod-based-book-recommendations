import React  from 'react'
import './SideBar.scss'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import homeIcon from '../../../Assets/home-icon.png'
import favorites from '../../../Assets/favorites.png'
import settings from '../../../Assets/settings.png'
import Recommendations from '../Recommendations'
import SavedBooks from '../BookList/SavedBooks'
import RatedBooks from '../BookList/RatedBooks'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import RecommenderSystems from '../Preferences/RecommenderSystems'
import Profile from '../Profile'
import About from '../About';
import Welcome from '../../Welcome'
import logout from '../../../Assets/logout.png'


class Header extends React.Component {

    render(){
        return(
            <div className='Principal-Side-Bar'>
            <Route render={({ location, history }) => (
                <React.Fragment>
                    <SideNav
                        onSelect={(selected) => {
                            const to = '/' + selected;
                            if (location.pathname !== to) {
                                history.push(to);
                            }
                        }}
                    >
                    <SideNav.Toggle />

                        <SideNav.Nav defaultSelected="" className="Principal-navIcons">

                            <NavItem eventKey="">
                                <NavIcon>
                                    <img src={homeIcon} className='Principal-SideBar-icon' />
                                </NavIcon>
                                <NavText>
                                    Home
                                </NavText>
                            </NavItem>

                            <NavItem eventKey="SavedBooks">

                                <NavIcon>
                                    <img src={favorites} className='Principal-SideBar-icon' />
                                </NavIcon>
                                <NavText>
                                    Lists
                                </NavText>

                                <NavItem eventKey="SavedBooks">
                                    <NavText>
                                        Saved books
                                    </NavText>
                                </NavItem>

                                <NavItem eventKey="RatedBooks">
                                    <NavText>
                                        Rated books
                                    </NavText>
                                </NavItem>

                            </NavItem>

                            <NavItem eventKey="RecommenderSystems">

                                <NavIcon>
                                        <img src={settings} className='Principal-SideBar-icon' />
                                </NavIcon>
                                <NavText>
                                    Recommender Systems
                                </NavText>

                            </NavItem>
                    
                        </SideNav.Nav>

                    </SideNav>
                    <main>
                        <Route path="/" exact render={ ()=><Recommendations/> } />
                        <Route path="/SavedBooks" component={SavedBooks} />
                        <Route path="/RatedBooks" component={RatedBooks} />
                        <Route path="/RecommenderSystems" component={RecommenderSystems} />
                        <Route path="/Profile" component={Profile} />
                        <Route path="/About" component={About} />
                    </main>
                </React.Fragment>
            )}
            />
        </div>
        )
    }
}
export default Header