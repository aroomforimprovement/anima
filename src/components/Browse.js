import React from 'react';
import Collection from './Collection';

const Browse = () => {
    return(
        <div className='mt-5'>
        <Collection browse={true}/>
        </div>
    );
}

export default Browse;