import React from 'react';

export const Problem = ({message}) => {
    return(
        <div className='px-4 py-5 my-5 text-center'>
            <img src='/assets/fail.svg' className='d-block mx-auto mb-4 col-2' alt='error' />
            <h4>{message}</h4>
            <button 
                className={'btn btn-primary m-5 p-2'} 
                onClick={() => {window.location.href = './'}}
            >Take me home!</button>
        </div>
    );
}