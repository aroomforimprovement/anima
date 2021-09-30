import React from "react";


export const CollectionItem = ({anim}) => {
    
    return(
        <div className='container border border-black rounded'>
            <img src='' alt={anim.name}></img>
            <h6>{anim.name}</h6>
        </div>
    );
}