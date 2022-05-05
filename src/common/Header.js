import React, { useState } from 'react';
import { Navbar, NavItem, NavbarToggler, NavbarBrand, Nav, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { LoginBtn, LogoutBtn, SignupBtn } from './AuthBtns';
import { Loading } from './Loading';
import { SITE } from '../shared/site';
import toast from 'buttoned-toaster';
import { useAccount } from '../shared/account';

const Header = () => {
    
    const {account} = useAccount();
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
                            {!account || !account.isSet
                                ? <Loading /> 
                                : account.user && account.user.isAuth 
                                ? account.user.isVerified
                                ? <NavItem className='nav-item nav-i'>
                                    <a className='nav-link' href={`/collection/${account.user.userid}`}>
                                        <span className='fa fa-film fa-md m-1'></span> Collection
                                    </a>
                                </NavItem>
                            : <NavItem className='nav-item nav-i'>
                                <a className='nav-link' href='#_Verify_your_account_to_access_Collection_page_' >
                                    <span className='fa fa-film fa-md m-1'
                                        onClick={() => {toast.error("Verify your account to access Collection page")}}>Collection *</span>
                                </a>
                            </NavItem> : null}
                            <NavItem className='nav-item nav-i'>
                                <a className='nav-link' href='/browse'>
                                    <span className='fa fa-eye fa-md m-1'></span> Browse
                                </a>
                            </NavItem>
                        </Nav>
                        <div className='auth-nav-wrapper'>
                            {!account || !account.isSet ? <Loading /> :
                            <Nav className='auth-nav' navbar >
                                <NavItem className='nav-item nav-i'>
                                    {!account || (account && account.user && account.user.isAuth) ? null : <LoginBtn size='btn-sm mt-2' href='/login' />}
                                </NavItem>
                                <NavItem className='nav-item nav-i'>
                                    {!account || (account && account.user && account.user.isAuth) ? <LogoutBtn size='btn-sm mt-2' href='/logout' /> : null}
                                </NavItem>
                                <NavItem className='nav-item nav-i'>
                                    {!account || (account && account.user && account.user.isAuth) ? null : <SignupBtn size='btn-sm mt-2' href='/signup' />}
                                </NavItem>
                                <NavItem className='nav-item nav-i ms-3'>
                                    {!account || (account && account.user && account.user.isAuth) 
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