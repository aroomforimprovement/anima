import React from 'react';
import { Jumbotron } from 'reactstrap';
import { SITE } from '../shared/site';
import LoginBtn from './partials/LoginBtn';
import LogoutBtn from './partials/LogoutBtn';
import SignupBtn from './partials/SignupBtn';

const Home = () => {
    return (
        <div className='container col-12 justify-content-center'>
            <Jumbotron >
                <div className='row home-page-heading'>
                    <h3>{SITE.home_heading}</h3>
                    <p>{SITE.home_sub_heading}</p>
                </div>
                <div className='row'>
                    <img className='sample-anim col-lg-5 col-md-8 col-sm-12' src='assets/sample.gif' alt='Sample animation' />
                </div>
                <div className='row'>
                    <div className='home-page-btn-rack col-lg-5 col-md-8 col-sm-12'>
                        <button type='button' className='btn btn-primary btn-lg m-1'>Create</button>
                        <LoginBtn size='btn-lg' href='/login'/>
                        <LogoutBtn size='btn-lg' href='/logout'/>
                        <SignupBtn size='btn-lg' href='/signup' />
                    </div>
                </div>
            </Jumbotron>
        </div>
    );
}

export default Home;