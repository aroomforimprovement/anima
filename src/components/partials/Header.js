import React, { useEffect, useReducer } from 'react';
import { Navbar, NavItem, NavbarToggler, NavbarBrand, Nav, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { LoginBtn, LogoutBtn, SignupBtn } from './AuthBtns';
import { Loading } from './Loading';
import { SITE } from '../../shared/site';
import { useAuth0 } from '@auth0/auth0-react';


const Header = () => {
    
    const { isAuthenticated, isLoading, user } = useAuth0();
    
    const checkAuth = (auth) => {
        console.log('checkAuth');
        if(isAuthenticated && user){
            console.log('writing auth');
            const u = user.sub.replace('auth0|', '');
            window.localStorage.setItem('userid', u);
            window.localStorage.setItem('email', user.email);
            window.localStorage.setItem('username', user.nickname);
            window.localStorage.setItem('isAuth', true);
        }else{
            console.log('removing auth');
            window.localStorage.removeItem('userid');
            window.localStorage.removeItem('email');
            window.localStorage.removeItem('username');
            window.localStorage.removeItem('isAuth');
        }
    }
    checkAuth(window.localStorage.getItem('isAuth'));

    const headerReducer = (state, action) => {
        console.log(action.type+":"+action.data);
        switch(action.type){
            case 'toggleNav':{
                return ({...state, isNavOpen: !state.isNavOpen});
            }
            case 'checkAuth':{
                checkAuth();
                return (state);
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
        if(!isLoading && isAuthenticated){
            dispatch({type: 'checkAuth', data: isAuthenticated});
        }
    },[isLoading, isAuthenticated]);


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
                                <NavLink className='nav-link' to='/collection'>
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
                            <Nav className='auth-nav' navbar >
                                <NavItem className='nav-item nav-i'>
                                    {isLoading ? <Loading /> : isAuthenticated ? null : <LoginBtn size='btn-sm' href='/login' />}
                                </NavItem>
                                <NavItem className='nav-item nav-i'>
                                    {isLoading ? <Loading /> : isAuthenticated ? <LogoutBtn size='btn-sm' href='/logout' /> : null}
                                </NavItem>
                                <NavItem className='nav-item nav-i'>
                                    {isLoading ? <Loading /> : isAuthenticated ? null : <SignupBtn size='btn-sm' href='/signup' />}
                                </NavItem>
                            </Nav>
                        </div>
                    </Collapse>
                </div>
            </Navbar>
        </div>
    )    
}

export default Header;