import React, { useEffect } from 'react';
import { Problem } from '../../common/Problem';
import { useCollectionContext } from './Collection';
import toast from 'buttoned-toaster';

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

    useEffect(() => {
        toast.fire({message: "Press ESC to close viewer", duration: 2000, });
    }, [])

    const Footer = () => {

        const Title = ({title}) => 
            <div className='col float-start coll-viewer-info-name'>
                {title}
            </div>
        
        const User = ({id, name}) => 
            <small className='col float-end'>
                <a 
                    href={`/collection/${id}`} 
                    alt='Visit profile'
                >
                    {name}
                </a>
            </small>

        const Length = ({frames, frate}) => 
            <div className='col float-start pt-3'>
                <small>
                    {parseFloat(frames / frate).toFixed(2)}
                </small>
            </div>

        const Created = ({created}) => 
            <div className='col float-end pt-3'>
                <small>
                    {new Date(created).toDateString()}
                </small>
            </div>

        const Info = ({anim}) => {
            return(
                <div className='col col-12 col-sm-10 col-md-9 col-lg-6 container rounded p-2 mt-2 float-center coll-viewer-info'>
                    <div className='col col-12'>
                        <div className='row '>
                            <Title title={anim.name}/>
                            <User id={anim.userid} name={anim.username}/>                    
                        </div>
                    </div>
                    <div className='col col-12' >
                        <div className='row'>
                            <Length 
                                frames={anim.frames ? anim.frames.length : 1}
                                frate={anim.frate}
                            />
                            <Created created={anim.created}/>
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
            <video controls loop autoPlay muted className='rounded-3 coll-viewer-video'
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