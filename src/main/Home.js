import React from 'react';
import { Jumbotron } from 'reactstrap';
import { SITE } from '../shared/site';
import { LoginBtn, LogoutBtn, SignupBtn } from '../common/AuthBtns';
import { NavLink } from 'react-router-dom';
import { Loading } from '../common/Loading';
import { useAccount } from '../shared/account';

const Home = () => {
    
    const {account} = useAccount();

    return (
        <div className='container col-12 justify-content-center'>
            <Jumbotron className='jumbotron'>
                <div className='row home-page-heading'>
                    <h3>{SITE.home_heading}</h3>
                    <p>{SITE.home_sub_heading}</p>
                </div>
                <div className='row'>
                    <img className='sample-anim col-lg-5 col-md-8 col-sm-12 rounded-3' src='assets/sample.gif' alt='Sample animation' />
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
                        {!account ? <Loading /> : (account && account.user && account.user.isAuth) ? null : <LoginBtn size='btn-lg' href='/login'/>}
                        {!account ? <Loading /> : (account && account.user && account.user.isAuth) ? <LogoutBtn size='btn-lg' href='/logout'/> : null}
                        {!account ? <Loading /> : (account && account.user && account.user.isAuth) ? null : <SignupBtn size='btn-lg' href='/signup' />}
                    </div>
                </div>
            </Jumbotron>
        </div>
    );
}

export default Home;