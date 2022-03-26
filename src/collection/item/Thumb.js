import React from 'react';
import { Loading } from '../../common/Loading';
//import { isMobile } from 'react-device-detect';
import { ViewerProgressBar } from '../../common/ProgressBar';

export const Thumb = ({previewFile, name, max, now}) => {
    const isMobile = false;  

    /***ANIM-229 - useRef didn't work to fix preview image
     * not updating after anim delete
     * const previewRef = useRef(null);

    useEffect(() => {
        const setRef = () => {
            previewRef && previewRef.current 
            ? previewRef.current.src = previewFile 
            : console.debug("no ref");
        }
        setRef();
    }, [previewFile, name]);
    */
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
                    <img key={Date.now()}
                        src={previewFile}
                        //ref={previewRef}
                        alt={name} />
                </div>
                :
                <div className='row'>
                    <video autoPlay loop className='rounded p-0'>
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