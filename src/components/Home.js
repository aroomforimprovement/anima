import React, { useEffect, useState } from 'react';
import { Jumbotron } from 'reactstrap';
import { SITE } from '../shared/site';
import { LoginBtn, LogoutBtn, SignupBtn } from './partials/AuthBtns';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Loading } from './partials/Loading';

const Home = () => {
    
    const { isAuthenticated, isLoading } = useAuth0();
    const [ auth, setAuth ] = useState(window.localStorage.getItem('isAuth'));

    useEffect(() => {
        if(!isLoading){
            setAuth(isAuthenticated);
        }
    },[isLoading, isAuthenticated]);

    return (
        <div className='container col-12 justify-content-center'>
            <Jumbotron className='jumbotron'>
                <div className='row home-page-heading'>
                    <h3>{SITE.home_heading}</h3>
                    <p>{SITE.home_sub_heading}</p>
                </div>
                <div className='row'>
                    <img className='sample-anim col-lg-5 col-md-8 col-sm-12' src='assets/sample.gif' alt='Sample animation' />
                </div>
                <div className='row'>
                    <div className='home-page-btn-rack col-lg-5 col-md-8 col-sm-12'>
                        <NavLink to='/create'>
                            <button type='button' 
                                className='btn btn-primary btn-lg m-1' 
                                href='/create'>
                                    Create
                                </button>
                        </NavLink>
                        {isLoading ? <Loading /> : isAuthenticated ? null : <LoginBtn size='btn-lg' href='/login'/>}
                        {isLoading ? <Loading /> : isAuthenticated ? <LogoutBtn size='btn-lg' href='/logout'/> : null}
                        {isLoading ? <Loading /> : isAuthenticated ? null : <SignupBtn size='btn-lg' href='/signup' />}
                    </div>
                </div>
            </Jumbotron>
        </div>
    );
}

export default Home;