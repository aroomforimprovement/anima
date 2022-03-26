import React, { useState } from 'react';
import { Navbar, NavItem, NavbarToggler, NavbarBrand, Nav, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { LoginBtn, LogoutBtn, SignupBtn } from './AuthBtns';
import { Loading } from './Loading';
import { SITE } from '../shared/site';
import { useMainContext } from '../main/Main';

const Header = () => {
    
    const { mainState } = useMainContext();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const logo = process.env.REACT_APP_URL + '/assets/site-logo.svg'
    
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }


    return(
        <div className='nav-area col-12'>
            <Navbar dark expand='md'>
                <div className='container'>
                    <NavbarToggler onClick={toggleNav} /> 
                    <NavbarBrand className='mr-auto' href='/home'>
                        <img src={logo} height='40px' width='40px'
                            alt={SITE.name}/>
                    </NavbarBrand>            
                    <Collapse isOpen={isNavOpen} navbar>
                        <Nav className='col-10 col-md-9' navbar>
                            <NavItem className='nav-item nav-i'>
                                <NavLink className='nav-link' to='/create'>
                                    <span className='fa fa-paint-brush fa-md m-1'></span> Create
                                </NavLink>
                            </NavItem>
                            {!mainState ? <Loading /> : mainState.user && mainState.user.isAuth ? <NavItem className='nav-item nav-i'>
                                <a className='nav-link' href={`/collection/${mainState.user.userid}`}>
                                    <span className='fa fa-film fa-md m-1'></span> Collection
                                </a>
                            </NavItem> : null}
                            <NavItem className='nav-item nav-i'>
                                <a className='nav-link' href='/browse'>
                                    <span className='fa fa-eye fa-md m-1'></span> Browse
                                </a>
                            </NavItem>
                        </Nav>
                        <div className='auth-nav-wrapper'>
                            {!mainState ? <Loading /> :
                            <Nav className='auth-nav' navbar >
                                <NavItem className='nav-item nav-i'>
                                    {!mainState || (mainState && mainState.user && mainState.user.isAuth) ? null : <LoginBtn size='btn-sm mt-2' href='/login' />}
                                </NavItem>
                                <NavItem className='nav-item nav-i'>
                                    {!mainState || (mainState && mainState.user && mainState.user.isAuth) ? <LogoutBtn size='btn-sm mt-2' href='/logout' /> : null}
                                </NavItem>
                                <NavItem className='nav-item nav-i'>
                                    {!mainState || (mainState && mainState.user && mainState.user.isAuth) ? null : <SignupBtn size='btn-sm mt-2' href='/signup' />}
                                </NavItem>
                                <NavItem className='nav-item nav-i ms-3'>
                                    {!mainState || (mainState && mainState.user && mainState.user.isAuth) 
                                        ? <NavLink className='nav-link account-nav mt-1 mt-md-0 border rounded-circle' 
                                            to='/account' >
                                            <span className='fa fa-md fa-user text-center'>{''}</span> 
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