import React, { useEffect, useState } from 'react';

export const Info = ({anim}) => {
    
    const [name, setName] = useState();

    useEffect(() => {
        let n = anim.name
        if(n.length >= 50){
            n = n.substring(0, 50);
            n = n.substring(0, n.lastIndexOf(' ')) + '...';
        }
        setName(n);
    },[anim.name]);

    return(
        <div className='row'>
            <div className='col col-12 mt-2 ms-2'>
                <div className='coll-item-name'>{name}</div>
                <div className='coll-item-username' >
                    <small>by <a href={`/collection/${anim.userid}`} alt='Visit profile'>{anim.username}</a></small>
                </div>
            </div>
            <div className='row coll-item-nums'>
                <div className='col col-2 ms-2'>
                    <small>{parseFloat(anim.frames ? anim.frames.length / anim.frate : 1 / anim.frate).toFixed(2)}</small>
                </div>
                <div className='col col-8 ms-2 me-0 pe-0 coll-item-date'>
                    <small>{new Date(anim.created).toDateString()}</small>
                </div>
            </div>
        </div>
    )
}