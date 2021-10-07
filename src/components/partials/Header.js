import React, { useEffect, useReducer } from 'react';
import { Navbar, NavItem, NavbarToggler, NavbarBrand, Nav, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { LoginBtn, LogoutBtn, SignupBtn } from './AuthBtns';
import { Loading } from './Loading';
import { SITE } from '../../shared/site';
import { useAuth0 } from '@auth0/auth0-react';
import { useMainContext } from '../Main';

const Header = () => {
    
    const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
    const { mainState, mainDispatch } = useMainContext();

    const headerReducer = (state, action) => {
        console.debug(action.type+":"+action.data);
        switch(action.type){
            case 'toggleNav':{
                return ({...state, isNavOpen: !state.isNavOpen});
            }
            case 'checkAuth':{
                mainDispatch({
                    type: 'CHECK_AUTH',
                    data: action.data
                });
                return(state);
            }
            case 'setAccess':{
                mainDispatch({
                    type: 'SET_ACCESS',
                    data: action.data
                });
                return ({...state, isSet: true});
            }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(headerReducer, {isNavOpen: false});
    
    const logo = process.env.REACT_APP_URL + '/assets/site-logo.svg'
    
    const toggleNav = () => {
        dispatch({type: 'toggleNav', data: !state.isNavOpen})
    }
    useEffect(() => {
        const setAccessToken = async () => {
            dispatch({type: 'setAccess', data: await getAccessTokenSilently()});
        }
        if(!isLoading){
            dispatch({
                type: 'checkAuth', 
                data: {
                    isAuthenticated: isAuthenticated,
                    user: user
                }});
        }
        if(isAuthenticated && !state.isSet){
            setAccessToken();
        }
    },[isLoading, isAuthenticated, user, getAccessTokenSilently, state.isSet]);


    return(
        <div className='nav-area col-12'>
            <Navbar dark expand='md'>
                <div className='container'>
                    <NavbarToggler onClick={toggleNav} /> 
                    <NavbarBrand className='mr-auto' href='/home'>
                        <img src={logo} height='40px' width='40px'
                            alt={SITE.name}/>
                    </NavbarBrand>            
                    <Collapse isOpen={state.isNavOpen} navbar>
                        <Nav className='col-10 col-md-9' navbar>
                            <NavItem className='nav-item nav-i'>
                                <NavLink className='nav-link' to='/create'>
                                    <span className='fa fa-paint-brush fa-md m-1'></span> Create
                                </NavLink>
                            </NavItem>
                            {isLoading ? <Loading /> : isAuthenticated ? <NavItem className='nav-item nav-i'>
                                <NavLink className='nav-link' to={`/collection/${window.localStorage.getItem('userid')}`}>
                                    <span className='fa fa-film fa-md m-1'></span> Collection
                                </NavLink>
                            </NavItem> : null}
                            <NavItem className='nav-item nav-i'>
                                <NavLink className='nav-link' to='/browse'>
                                    <span className='fa fa-eye fa-md m-1'></span> Browse
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <div className='auth-nav-wrapper'>
                            {isLoading ? <Loading /> :
                            <Nav className='auth-nav' navbar >
                                <NavItem className='nav-item nav-i'>
                                    {isAuthenticated ? null : <LoginBtn size='btn-sm' href='/login' />}
                                </NavItem>
                                <NavItem className='nav-item nav-i'>
                                    {isAuthenticated ? <LogoutBtn size='btn-sm' href='/logout' /> : null}
                                </NavItem>
                                <NavItem className='nav-item nav-i'>
                                    {isAuthenticated ? null : <SignupBtn size='btn-sm' href='/signup' />}
                                </NavItem>
                                <NavItem>
                                    {isAuthenticated 
                                        ? <NavLink className='nav-link rounded-circle border border-secondary ms-3 px-2 py-1' 
                                            to='/account' >
                                            <span className='fa fa-user '>{' '}</span>    
                                        </NavLink> 
                                        : null}
                                </NavItem>
                            </Nav>
                            }
                        </div>
                    </Collapse>
                </div>
            </Navbar>
        </div>
    )    
}

export default Header;