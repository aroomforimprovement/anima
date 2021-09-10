import React from 'react';

export const Problem = ({message}) => {
    return(
        <div className='col-12'>
            <span className='fa fa-skull fa-3x fa-fw'></span>
            <p>{message}</p>
            <p><a href='/home'>Take me home!</a></p>
        </div>
    );
}