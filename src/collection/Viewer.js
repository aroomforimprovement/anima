import React, { useState } from 'react';
import { Problem } from '../common/Problem';
import { useCollectionContext } from './Collection';
import { useResizeDetector } from 'react-resize-detector';

export const Viewer = ({viewFile, name}) => {
    const {collectionState, setCollectionState} = useCollectionContext();
    const { width, height } = useResizeDetector();
    const [dim, setDim] = useState(width > height ? height : width)
    const handleClose = () => {
        setCollectionState({type: 'SET_VIEWER_OPEN', date: false});
        setCollectionState({type: 'SET_VIEW_FILE', data: null})
    }
    console.log(dim);
    return(
       <div className='fullscreen'>
           <div className='fullscreen-header mb-3'>
               <button className='btn-close me-2'
                    onClick={handleClose}>
                   
               </button>
           </div>
           {viewFile 
            ?
            <video controls loop autoPlay muted 
                style={{maxWidth:'100%'}}>
                <source src={viewFile} type='video/webm' alt={`Viewing ${name}`}
                    />
            </video>
            :
            <Problem message={"There was a problem loading the video :("}/>
            }
            <div className='fullscreen-footer'>
                <div>
                    {name}
                </div>
                
            </div>
       </div> 
    );
}    