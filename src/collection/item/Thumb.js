import React, { useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { Loading } from '../../common/Loading';

export const Thumb = ({previewFile, name}) => {

    const previewRef = useRef(null);

    useEffect(() => {
        const setRef = () => {
            previewRef && previewRef.current 
            ? previewRef.current.src = previewFile 
            : console.log("no ref");
        }
        setRef();
    }, [previewFile, name]);

    return(
        <div>
            {
            previewFile 
            ?
            <div>
                {
                isMobile
                ?
                <div className='row'>
                    <img src={previewFile}
                        ref={previewRef}
                        alt={name} />
                </div>
                :
                <div className='row'>
                    <video autoPlay loop className='rounded p-0'>
                        <source src={previewFile}
                            ref={previewRef}
                            type='video/webm'
                            alt={`Previewing ${name}`}/>
                    </video>
                </div>
                }
            </div>
            :
            <Loading />             
            }
        </div>
    );
}