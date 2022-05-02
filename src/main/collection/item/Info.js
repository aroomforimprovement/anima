import React from 'react';

export const Info = ({anim}) => {
    return(
        <div className='row'>
            <div className='col col-12 mt-2 ms-2'>
                <div className='coll-item-name'>{anim.name}</div>
                <div className='coll-item-username' >
                    <small>by <a href={`/collection/${anim.userid}`} alt='Visit profile'>{anim.username}</a></small>
                </div>
            </div>
            <div className='row'>
                <div className='col col-2 ms-2'>
                    <small>{parseFloat(anim.frames ? anim.frames.length / anim.frate : 1 / anim.frate).toFixed(2)}</small>
                </div>
                <div className='col col-8 ms-2 coll-item-date'>
                    <small>{new Date(anim.created).toDateString()}</small>
                </div>
            </div>
        </div>
    )
}