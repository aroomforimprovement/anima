import React from 'react';
import { Jumbotron } from 'reactstrap';

const Home = (props) => {
    return (
        <div className='container col-12 justify-content-center'>
            <Jumbotron >
                <div className='row home-page-heading'>
                    <h3>Welcome to Animator</h3>
                    <p>Animation without the patience</p>
                </div>
                <div className='row'>
                    <img className='sample-anim col-lg-5 col-md-8 col-sm-12' src='assets/sample.gif' alt='Sample animation' />
                </div>
                <div className='row'>
                    <div className='home-page-btn-rack col-lg-5 col-md-8 col-sm-12'>
                        <button type='button' className='btn btn-primary btn-lg m-1'>Create</button>
                        <button type='button' className='btn btn-outline-secondary btn-lg m-1'>Login</button>
                        <button type='button' className='btn btn-outline-secondary btn-lg m-1'>Sign-up</button>
                    </div>
                </div>
            </Jumbotron>
        </div>
    );
}

export default Home;