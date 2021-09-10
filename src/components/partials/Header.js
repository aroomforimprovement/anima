import React, { useReducer } from 'react';
import { Navbar, NavItem, NavbarToggler, NavbarBrand, Nav, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { LoginBtn, LogoutBtn, SignupBtn } from './AuthBtns';
import { SITE } from '../../shared/site';

const Header = ({isAuthenticated}) => {

    const headerReducer = (state, action) => {
        console.log(action.type+":"+action.data);
        switch(action.type){
            case 'toggleNav':{
                return ({...state, isNavOpen: !state.isNavOpen});
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

    return(
        <div className='nav-area'>
            <Navbar  light expand="md">
                <div className='container'>
                    <NavbarToggler onClick={toggleNav} /> 
                    <NavbarBrand className='mr-auto' href='/'>
                        <img src={logo} height='40px' width='40px'
                            alt={SITE.name}/>
                    </NavbarBrand>            
                    <Collapse isOpen={state.isNavOpen} navbar>
                        <Nav navbar>
                            <div className='nav'>
                                <NavItem>
                                    <NavLink className='nav-link' to='/create'>
                                        <span className='fa fa-paint-brush fa-md m-1'></span> Create
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className='nav-link' to='/collection'>
                                        <span className='fa fa-star fa-md m-1'></span> Collection
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className='nav-link' to='/browse'>
                                        <span className='fa fa-eye fa-md m-1'></span> Browse
                                    </NavLink>
                                </NavItem>
                            </div>
                            <div className='nav auth-nav'>
                                {isAuthenticated ? null : <LoginBtn size='btn-md' href='/login' />}
                                {isAuthenticated ? <LogoutBtn size='btn-md' href='/logout' /> : null}
                                {isAuthenticated ? null : <SignupBtn size='btn-md' href='/signup' />}
                            </div>
                        </Nav>
                    </Collapse>
                </div>
            </Navbar>
        </div>
    )    
}

export default Header;