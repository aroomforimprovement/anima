import React from 'react';

export const Loading = ({message}) => {
    return(
        <div className='loading col-1'>
            <span className='fa fa-spinner fa-pulse fa-1x fa-fw'></span>
            <p>{message}</p>
        </div>
    );
}