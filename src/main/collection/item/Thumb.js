import React from 'react';
import { Loading } from '../../../common/Loading';

export const Thumb = ({previewFile, name, max, now}) => {
    const isMobile = false;  

    return(
        <div className='coll-item-thumb'>
            {
            previewFile 
            ?
            <div>
                {
                isMobile
                ?
                <div className='row'>
                    <img key={Date.now()}
                        src={previewFile}
                        //ref={previewRef}
                        alt={name} />
                </div>
                :
                <div className='row '>
                    <video autoPlay loop 
                    //className='coll-item-video'
                    className='rounded-3 p-0'
                    >
                        <source key={Date.now()} src={previewFile}
                            //ref={previewRef}
                            type='video/webm'
                            alt={`Previewing ${name}`}/>
                    </video>
                </div>
                }
            </div>
            :
            <Loading/>             
            }
        </div>
    );
}