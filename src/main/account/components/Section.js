import React, { useState } from 'react';

export const Section = ({children, name, showHandler, hideSection}) => {

    const [isHidden, setIsHidden] = useState(true);
    
    return(
        <div className='row section mt-5'>
            <div className='section-header' 
                onClick={() => {setIsHidden(!isHidden)}}><div className='section-text'>{name}</div></div>
                <div className={isHidden ? '' : 'container' } hidden={isHidden}>
                    {children}
            </div>
        </div>
    )
}
