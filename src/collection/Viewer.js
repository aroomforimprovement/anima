import React from 'react';
import { Problem } from '../common/Problem';
import { useCollectionContext } from './Collection';

export const Viewer = ({viewFile, name}) => {
    const {collectionState, setCollectionState} = useCollectionContext();
    
    const handleClose = () => {
        setCollectionState({type: 'SET_VIEWER_OPEN', date: false});
        setCollectionState({type: 'SET_VIEW_FILE', data: null})
    }
    return(
       <div className='fullscreen'>
           <div className='fullscreen-header'>
               <button className='btn-close'
                    onClick={handleClose}>
                   
               </button>
           </div>
           {viewFile 
            ?
            <video controls loop autoPlay muted >
                <source src={viewFile} type='video/webm' alt={`Viewing ${name}`}/>
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