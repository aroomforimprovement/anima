import React from "react";


export const CollectionItem = ({anim}) => {
    console.log("COLLECTION ITEM: ");
    console.dir(anim);
    return(
        <div className='container border border-black rounded'>
            <div className='row'>
                <img src='' alt={anim.name}
                    className='col col-3 border mt-2 ms-2'></img>
                <h6>{anim.name}</h6>
                <div>by {anim.username}</div>
                <div>Created: {anim.created}</div>
                <div>Length: {parseFloat(anim.frames ? anim.frames.length : 1 / anim.frate).toFixed(2)}</div>
            </div>
        </div>
    );
}