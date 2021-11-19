import React, { useState, useReducer, useEffect } from "react";
import { SITE } from "../../shared/site";
import { Modal, Button } from "react-bootstrap";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { preview } from "../../animator/preview";
import { Loading } from './Loading';
import LazyLoad from "react-lazyload";
import { saveAs } from 'file-saver';
import { useMainContext } from "../Main";
import { useCollectionContext } from "../Collection";
import toast from "react-hot-toast";
import { ToastConfirm } from "./Toast";


const collectionItemInitialState = {viewFile: null, viewName: null, 
    previewFile: null, previewName: null, hidden: false, deleted: false}

const apiUrl = process.env.REACT_APP_API_URL;


export const CollectionItem = ({anim, index}) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { mainState } = useMainContext();
    const { collectionState, setCollectionState } = useCollectionContext();


    const collectionItemReducer = (state, action) => {
        
        const deleteAnim = async (animid) => {
            const url = `${apiUrl}anim/${animid}`;
            const req = {
                method: 'DELETE',
                mode: 'cors'
            }
            if(mainState.user.access){
                req.headers = {
                    Authorization: `Bearer ${mainState.user.access}`,
                    'Content-Type': 'application/json'
                }
            }
            return fetch(url, req).then(response => {
                if(response.ok){
                    console.log("anim deleted ok ");
                    setCollectionState({type: 'DELETE_ANIM', data: animid});
                    toast.success("Anim deleted as requested");
                }else{
                    console.log("response not ok");
                    toast.error("Error deleting the anim");
                }
            }, error => {
                console.error(error);
            }).catch(error => { console.error(error);})
        }

        switch(action.type){
            case 'SET_PREVIEW_FILE':{
                const previewFile = URL.createObjectURL(action.data.blob);
                return ({...state, 
                    previewFile: previewFile, 
                    previewName: action.data.name,
                });
            }
            case 'SET_VIEW_FILE':{
                const viewFile = URL.createObjectURL(action.data.blob);
                return({...state,
                    viewFile: viewFile,
                    viewName: action.data.name
                });
            }
            case 'DELETE_ANIM':{
                deleteAnim(anim.animid);
                return({...state, deleted: true});
            }
            default:
                break;
        }
    }

    const [collectionItemState, collectionItemDispatch] = useReducer(collectionItemReducer, collectionItemInitialState);

    const handlePreview = (e) => {
        setIsPreviewOpen(true);
    }

    const handleDownload = (e) => {
       saveAs(collectionItemState.previewFile, anim.name);
    }

    const handleDelete = (e) => {
        const approve = (id) => {
            collectionItemDispatch({type: 'DELETE_ANIM', data: true});
            toast.dismiss(id);
        };
        const dismiss = (id) => {
            toast.dismiss(id);
        }

        toast((t) => (
            <ToastConfirm t={t} anim={anim} approve={approve} dismiss={dismiss} />
        ), {duration: 60000, style: {padding: 40}});
    }

    
    useEffect(() => {
        
    },[collectionItemState.previewFile, collectionState.index, collectionItemState.viewFile, isPreviewOpen]);


    return(
        <div className='col col-12 col-sm-5 col-md-3 col-lg-3 py-1 px-3 m-1 coll-item'>
            {mainState.isSet ? <LazyLoad height={300} offset={10} once>
                <div>    
                    <div >
                    {collectionItemState.previewFile 
                    ? <div className='row'>
                        <video autoPlay loop className='rounded p-0'> 
                            <source src={collectionItemState.previewFile} type='video/webm' alt={`Previewing ${anim.name}`} />
                        </video> 
                    </div>
                    : <Loading /> }
                    <div className='row'>
                        <div className='col col-12 mt-2 ms-2'>
                            <div className='coll-item-name'>{anim.name}</div>
                            <div className='coll-item-username' >
                                <small>by <a href={`/collection/${anim.userid}`} alt='Visit profile'>{anim.username}</a></small>
                            </div>
                        </div>
                        <div className='row'>
                        <div className='col col-2 ms-2'>
                            <small>{parseFloat(anim.frames ? anim.frames.length / anim.frate : 1 / anim.frate).toFixed(2)}</small>
                        </div>
                        <div className='col col-8 ms-2 coll-item-date'>
                            <small>{new Date(anim.created).toDateString()}</small>
                        </div>
                    </div>
                    <div className='col col-12'>
                        <div className='row coll-item-btns mt-1 mb-1'>
                            { mainState.user && anim.userid === mainState.user.userid
                            ? <div className='col col-3'>
                                <button className='btn btn-outline-secondary'>
                                    <a href={`/create/${anim.animid}`} alt='edit'>
                                        <img src={SITE.icons.penColour} alt='edit' />
                                    </a>   
                                </button>
                            </div> :
                            <div></div>}
                            <div className='col col-3'>
                                <button className='btn btn-outline-secondary'
                                    onClick={handlePreview}>
                                        <img src={SITE.icons.preview} alt='preview'></img>
                                </button>
                            </div>
                            <div className='col col-3'>
                                <button className='btn btn-outline-secondary'
                                    onClick={handleDownload}>
                                    <img src={SITE.icons.download} alt='download'></img>
                                </button>
                            </div>
                            { mainState.user && anim.userid === mainState.user.userid
                            ? <div className='col col-3'>
                                <button className='btn btn-outline-secondary'
                                    onClick={handleDelete}>
                                    <img src={SITE.icons.wipe} alt='delete'></img>
                                </button>
                            </div>
                            : <div></div>}
                        </div>
                    </div>
                </div>
            </div>
            <Modal size='lg' show={isPreviewOpen} 
                onShow={() => {setIsPreviewOpen(true)}}
                onHide={() => {setIsPreviewOpen(false)}}>
                {isPreviewOpen && !collectionItemState.viewFile 
                ?  
                <ReactP5Wrapper sketch={preview} anim={anim} index={'temp'} id={`temp`}
                    collectionItemDispatch={collectionItemDispatch}
                    collectionState={collectionState}
                    setCollectionState={setCollectionState} clip={false}/>
                : <div></div>}
                {
                    collectionItemState.viewFile ?
                    <video controls loop autoPlay muted className='p-2'> 
                        <source src={collectionItemState.viewFile} type='video/webm' alt={`Viewing ${anim.name}`} />
                    </video> 
                :
                <Loading />
                }
                <Modal.Footer>
                    <div className='preview-name'>
                        <span >{anim.name}</span>
                    </div>
                    <Button size='sm' 
                        onClick={() => setIsPreviewOpen(false)}
                    >Close</Button>
                </Modal.Footer>
            </Modal > 
            {collectionItemState.previewFile || (collectionItemState.index <= index) 
                ? <div></div>
                :
                <div hidden={true}>    
                    <ReactP5Wrapper sketch={preview} anim={anim} index={index} id={`previewCanvas_${index}`}
                        collectionItemDispatch={collectionItemDispatch}
                        collectionState={collectionState}
                        setCollectionState={setCollectionState} clip={true}/>
                </div>
            } 
        </div>
    </LazyLoad>
    : <div></div>}
    </div>
    );
}