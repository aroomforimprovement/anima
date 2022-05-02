import React, { useEffect } from 'react';
import { Problem } from '../../common/Problem';
import { useCollectionContext } from './Collection';

export const Viewer = ({viewFile, anim, name}) => {
    const { setCollectionState } = useCollectionContext();
    
    const handleClose = () => {
        setCollectionState({type: 'SET_VIEWER_OPEN', date: false});
        setCollectionState({type: 'SET_VIEW_FILE', data: null})
    }

    useEffect(() => {
        const escFunction = (e) => {
            if(e.key === 'Escape'){
                handleClose();
            }
        }
        document.addEventListener('keydown', escFunction, false);
        return () => {
            document.removeEventListener('keydown', escFunction, false);
        }
    })


    const Footer = () => {
        const Info = ({anim}) => {
            return(
                <div className='container rounded p-2 mt-2 float-start'>
                    <div className='col col-12'>
                        <div className='row'>
                        <div className='col'>{anim.name}</div>
                        <small className='col ms-0'>
                            <a href={`/collection/${anim.userid}`} alt='Visit profile'>
                                {anim.username}
                            </a>
                        </small>
                        </div>
                    </div>
                    <div className='col col-12' >
                        <div className='row'>
                        <div className='col'>
                            <small>{parseFloat(anim.frames ? anim.frames.length / anim.frate : 1 / anim.frate).toFixed(2)}</small>
                        </div>
                        <div className='col'>
                            <small>{new Date(anim.created).toDateString()}</small>
                        </div>
                        </div>
                    </div>
                </div>
            )
        }
        return(
            <div className='container fullscreen-footer'>
                <Info anim={anim}/>
            </div>
        )
    }

    return(
       <div className='fullscreen'>
           <div className='fullscreen-header mb-3'>
               <button className='clickable btn-close me-2'
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
            <Footer />
       </div> 
    );
}    