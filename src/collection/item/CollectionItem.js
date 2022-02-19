import React, { useState, useReducer, useEffect } from "react";
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
import { Thumb } from "./Thumb";
import { Buttons } from "./Buttons";
import { Info } from "./Info";

const collectionItemInitialState = {viewFile: null, viewName: null, 
    previewFile: null, previewName: null, hidden: false, deleted: false}


export const CollectionItem = ({anim, index}) => {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const { mainState } = useMainContext();
    const { collectionState, setCollectionState } = useCollectionContext();


    const [collectionItemState, collectionItemDispatch] = useReducer(collectionItemReducer, collectionItemInitialState);

    const handleView = (e) => {
        setIsViewerOpen(true);
    }

    const handleDownload = (e) => {
        setIsDownloading(true);
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
        
    },[collectionState.anims]);



    return(
        <div className='col col-12 col-sm-5 col-md-3 col-lg-3 py-1 px-3 m-1 coll-item'>
            {mainState.isSet 
            ? <LazyLoad height={300} offset={10} once>
                <div>    
                    <div >
                        <Thumb previewFile={collectionItemState.previewFile}
                            name={anim.name}/>
                        <Info anim={anim} />
                        <Buttons anim={anim} user={mainState.user}
                            handleDelete={handleDelete} handleView={handleView}
                            handleDownload={handleDownload} isViewerOpen={isViewerOpen}/>
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