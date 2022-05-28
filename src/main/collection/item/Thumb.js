import React, { useState } from 'react';
import { Loading } from '../../../common/Loading';

export const Thumb = ({previewFile, thumbFile, name, max, now}) => {

    const [preview, setPreview] = useState(false);
    //console.log(thumbFile)
    return(
        <div className='coll-item-thumb'
            onMouseEnter={() => {setPreview(true)}}
            onMouseLeave={() => {setPreview(false)}}>
            {
            thumbFile
            ?
            <div>
                {
                !preview
                ?
                <div className='row'>
                    <img className='rounded-3 p-0'
                        key={Date.now()}
                        src={thumbFile}
                        //ref={previewRef}
                        alt={name} />
                </div>
                : previewFile ?
                <div className='row '>
                    <video autoPlay loop 
                    //className='coll-item-video'
                    className='rounded-3 p-0'
                    >
                        <source 
                            key={Date.now()} 
                            src={previewFile}
                            //ref={previewRef}
                            type='video/webm'
                            alt={`Previewing ${name}`}/>
                    </video>
                </div> : <Loading />
                }
            </div>
            :
            <Loading/>             
            }
        </div>
    );
}