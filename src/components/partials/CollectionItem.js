import React, { useState, createContext, useContext, useReducer, useEffect } from "react";
import { SITE } from "../../shared/site";
import { Modal, ModalFooter, Button } from "reactstrap";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { preview } from "../../animator/preview";
import { Loading } from './Loading';
import LazyLoad from "react-lazyload";
import { saveAs } from 'file-saver';


const collectionItemInitialState = {previewFile: null, previewName: null, hidden: false}
const CollectionItemContext = createContext(collectionItemInitialState);

export const useCollectionItemwContext = () => {
    return useContext(CollectionItemContext);
}

export const CollectionItem = ({anim}) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    
    const collectionItemReducer = (state, action) => {
        switch(action.type){
            case 'SET_PREVIEW_FILE':{
                const previewFile = URL.createObjectURL(action.data.blob);
                console.dir(previewFile);
                return ({...state, 
                    previewFile: previewFile, 
                    previewName: action.data.name  
                });
            }
            default:
                break;
        }
    }

    const [collectionItemState, collectionItemDispatch] = useReducer(collectionItemReducer, collectionItemInitialState);
    
    useEffect(() => {
        
    },[collectionItemState.previewFile]);

    const handlePreview = (e) => {
        setIsPreviewOpen(true);
    }

    const handleDownload = (e) => {
       saveAs(collectionItemState.previewFile, anim.name);
    }

    return(
        <LazyLoad height={400} offset={100} 
            className='col col-12 col-sm-5 col-md-3 col-lg-3 py-1 px-3 m-1 coll-item'>
            <div >
                <div className='row'>
                {
                    collectionItemState.previewFile ?
                <video loop autoPlay className='rounded p-0'> 
                    <source src={collectionItemState.previewFile} type='video/webm' alt={`Previewing ${anim.name}`} />
                </video> :
                <Loading />
                }
                </div>
                <div className='row'>
                    <div className='col col-12 mt-2 ms-2'>
                        <div >{anim.name}</div>
                        <div className='coll-item-username' ><small>by <a href={`/collection/${anim.userid}`} alt='Visit profile'>{anim.username}</a></small></div>
                    </div>
                    <div className='row'>
                        <div className='col col-2 ms-2'><small>{parseFloat(anim.frames ? anim.frames.length / anim.frate : 1 / anim.frate).toFixed(2)}</small></div>
                        <div className='col col-8 ms-2 coll-item-date'><small>{new Date(anim.created).toDateString()}</small></div>
                    </div>
                <div className='col col-12'>
                    <div className='row coll-item-btns ms-md-2 ms-lg-4 mt-1 mb-1'>
                        <div className='col col-4 col-md-3'>
                            <button className='btn btn-outline-secondary'>
                                <a href={`/create/${anim.animid}`} alt='edit'>
                                    <img src={SITE.icons.penColour} alt='edit' />
                                </a>   
                            </button>
                        </div>
                        <div className='col col-4 col-md-3'>
                            <button className='btn btn-outline-secondary'
                                onClick={handlePreview}>
                                    <img src={SITE.icons.preview} alt='preview'></img>
                            </button>
                        </div>
                        <div className='col col-4 col-md-3'>
                            <button className='btn btn-outline-secondary'
                                onClick={handleDownload}>
                                <img src={SITE.icons.download} alt='download'></img>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal size='lg' isOpen={isPreviewOpen} 
                toggle={() => {setIsPreviewOpen(!isPreviewOpen)}}>
                {
                    collectionItemState.previewFile ?
                <video controls loop autoPlay> 
                    <source src={collectionItemState.previewFile} type='video/webm' alt={`Previewing ${anim.name}`} />
                </video> :
                <Loading />
                }
                <ModalFooter>
                    <p>{anim.name}</p>
                    <Button size='sm' 
                        onClick={() => setIsPreviewOpen(false)}
                    >Close</Button>
                </ModalFooter>
            </Modal > 
            {
                collectionItemState.previewFile 
                ? <div></div>
                :
                <div hidden={true}>    
                    <ReactP5Wrapper sketch={preview} anim={anim}  id='previewCanvas'
                        collectionItemDispatch={collectionItemDispatch} />
                </div>
                } 
        </div>
    </LazyLoad>
    );
}