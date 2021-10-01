import React from "react";


export const CollectionItem = ({anim}) => {
    console.log("COLLECTION ITEM: ");
    console.dir(anim);
    return(
        <div className='container col col-6 col-lg-8 border border-black rounded coll-item'>
            <div className='row'>
                <img src='' alt={anim.name}
                    className='col col-3 border mt-2 ms-2'></img>
                <h5 className='col col-6 mt-2'>{anim.name}</h5>
            </div>
            <div className='row coll-item-detail mt-2 mb-2'>
                <div className='col col-6'>Created: {anim.created}</div>
                <div className='col col-6'>by {anim.username}</div>            
                {//not sure why frames is undefined at this point
                }
                <div>Length: {parseFloat(anim.frames ? anim.frames.length : 1 / anim.frate).toFixed(2)}</div>
            </div>
        </div>
    );
}