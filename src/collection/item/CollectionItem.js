import React, { useState, useReducer, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SITE } from "../../shared/site";
import { Modal, Button } from "react-bootstrap";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { preview } from "../../create/animation/preview";
import { Loading } from '../../common/Loading';
import LazyLoad from "react-lazyload";
import { useMainContext } from "../../main/Main";
import { useCollectionContext } from "../Collection";
import toast from "react-hot-toast";
import { ToastConfirm, toastConfirmStyle } from "../../common/Toast";
import { isMobile } from "react-device-detect";
import { collectionItemReducer } from './collectionItemReducer';

const collectionItemInitialState = {viewFile: null, viewName: null, 
    previewFile: null, previewName: null, hidden: false, deleted: false}

const apiUrl = process.env.REACT_APP_API_URL;


export const CollectionItem = ({anim, index}) => {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const { mainState } = useMainContext();
    const { collectionState, setCollectionState } = useCollectionContext();
    let history = useHistory();

    

    const [collectionItemState, collectionItemDispatch] = useReducer(collectionItemReducer, collectionItemInitialState);

    const handleView = (e) => {
        setIsViewerOpen(true);
    }

    const handleDownload = (e) => {
        //TODO should generated and download the viewFile instead 
        setIsDownloading(true);
        //downloadAnimAsWebm(anim, ?, ?);
       //saveAs(collectionItemState.previewFile, anim.name);
    }

    const handleDelete = (e) => {
        const approve = (id) => {
            collectionItemDispatch(
                {
                    type: 'DELETE_ANIM', 
                    data: {
                        animid: anim.animid,
                        user: mainState.user
                    }
                }
            );
            setCollectionState({type: 'DELETE_ANIM', data: anim.animid});
            toast.dismiss(id);
        };
        const dismiss = (id) => {
            toast.dismiss(id);
        }

        toast((t) => (
            <ToastConfirm t={t} approve={approve} dismiss={dismiss}
                message={`Are you sure you want to permanently delete anim \n"${anim.name}"`}
                approveBtn={"Delete"} dismissBtn={"Cancel"} />
        ), toastConfirmStyle());
    }

    useEffect(() => {
        
    },[collectionItemState.previewFile, collectionState.anims, collectionState.index, collectionItemState.viewFile, isViewerOpen]);



    return(
        <div className='col col-12 col-sm-5 col-md-3 col-lg-3 py-1 px-3 m-1 coll-item'>
            {mainState.isSet 
            ? <LazyLoad height={300} offset={10} once>
                <div>    
                    <div >
                        {
                        collectionItemState.previewFile 
                        ? 
                        <div>
                            {
                            isMobile 
                            ? 
                            <div className='row'>
                                <img src={collectionItemState.previewFile}
                                    alt={anim.name}
                                />
                            </div>
                            : 
                            <div className='row'>
                                <video autoPlay loop className='rounded p-0'> 
                                    <source src={collectionItemState.previewFile} 
                                    type='video/webm' alt={`Previewing ${anim.name}`} />
                                </video> 
                            </div>
                            }
                        </div>
                        : 
                        <Loading /> 
                        }
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
                                    onClick={handleView}>
                                        {isViewerOpen ? <Loading /> : <img src={SITE.icons.preview} alt='preview'></img>}
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
            <Modal  show={isViewerOpen} fullscreen={isMobile}
                onShow={() => {setIsViewerOpen(true)}}
                onHide={() => {setIsViewerOpen(false)}}>
                {isViewerOpen && !collectionItemState.viewFile
                ?  
                <ReactP5Wrapper sketch={preview} anim={anim} index={'temp'} id={`temp`}
                    collectionItemDispatch={collectionItemDispatch}
                    collectionState={collectionState} type='VIEW'
                    setCollectionState={setCollectionState} clip={false}/>
                : <div></div>}
                {
                    collectionItemState.viewFile ?
                    <video controls loop autoPlay muted className='coll-modal-video p-2'> 
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
                        onClick={() => setIsViewerOpen(false)}
                    >Close</Button>
                </Modal.Footer>
            </Modal > 
            {collectionItemState.previewFile || (collectionItemState.index <= index) 
                ? <div hidden={true}></div>
                :
                <div hidden={true}>    
                    <ReactP5Wrapper sketch={preview} anim={anim} index={index} id={`previewCanvas_${index}`}
                        collectionItemDispatch={collectionItemDispatch}
                        collectionState={collectionState} type='PREVIEW'
                        setCollectionState={setCollectionState} clip={true}/>
                </div>
            } 
            {collectionItemState.viewFile || !isDownloading
                ? <div hidden={true}></div>
                : <div hidden={true}>
                    <ReactP5Wrapper sketch={preview} anim={anim} index={'temp'} id={`temp`}
                    collectionItemDispatch={collectionItemDispatch}
                    collectionState={collectionState} type='DOWNLOAD'
                    setCollectionState={setCollectionState} clip={false}/>
                </div>                
            }
        </div>
    </LazyLoad>
    : <div></div>}
    </div>
    );
}