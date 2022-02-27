import React, { useState, useReducer } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { preview } from "../../create/animation/preview";
import LazyLoad from "react-lazyload";
import { useMainContext } from "../../main/Main";
import { useCollectionContext } from "../Collection";
import toast from "react-hot-toast";
import { ToastConfirm, toastConfirmStyle } from "../../common/Toast";
import { collectionItemReducer } from './collectionItemReducer';
import { Thumb } from "./Thumb";
import { Buttons } from "./Buttons";
import { Info } from "./Info";
import { Div } from "../../common/Div";
import { saveAs } from "file-saver";

const collectionItemInitialState = {viewFile: null, viewName: null, 
    previewFile: null, previewName: null, hidden: false, deleted: false}


export const CollectionItem = ({anim, index}) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const { mainState } = useMainContext();
    const { collectionState, setCollectionState } = useCollectionContext();
    const [collectionItemState, collectionItemDispatch] = useReducer(collectionItemReducer, collectionItemInitialState);

    const handleView = async (e) => {
        console.log("handleView");
        setCollectionState({type: 'SET_SELECTED_ANIM', data: anim});
        setCollectionState({type: 'SET_VIEWER_OPEN', data: true})
    }

    const handleDownload = async (e) => {
        if(collectionItemState.viewFile){
            fetch(collectionItemState.viewFile)
                .then((r) => {
                    r.blob().then((b) => saveAs(b, anim.name));
                    
                });
            setIsDownloading(false);
        }else{
            setIsDownloading(true);
        }
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
            // eslint-disable-next-line no-self-assign
            window.location.href = window.location.href;
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


    const RenderWrapper = ({anim, index, id, type, clip}) => {
        return(
            <div>
                <ReactP5Wrapper sketch={preview} anim={anim} index={index} id={id}
                        collectionItemDispatch={collectionItemDispatch}
                        collectionState={collectionState} type={type}
                        setCollectionState={setCollectionState} clip={clip}/>
            </div>
        );
    }

/***
    const Viewer = ({isViewerOpen, setIsViewerOpen, viewFile, anim}) => {
        return(
            <Modal show={isViewerOpen} fullscreen={isMobile}
                onShow={() => {setIsViewerOpen(true)}}
                onHide={() => {setIsViewerOpen(false)}}>
                {
                isViewerOpen && !viewFile
                ?  
                <PreviewWrapper anim={anim} index={'temp'} id={`temp`}
                type={'VIEW'} clip={false}/>
                : 
                <Div/>
                }
                {
                viewFile ?
                <video controls loop autoPlay muted className='coll-modal-video p-2'> 
                    <source src={viewFile} type='video/webm' alt={`Viewing ${anim.name}`} />
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
        );
    }
*/

    const PreviewGen = () => {
        return(
            <div hidden={true}>
                <RenderWrapper anim={anim} index={index} id={`previewCanvas_${index}`}
                    type={'PREVIEW'} clip={true} />
            </div>
        );
    }
    
    const DownloadGen = () => {
        return(
            <div hidden={true}>
                <RenderWrapper anim={anim} index={'temp'} id={`temp`}
                    type='DOWNLOAD' clip={false} />
            </div> 
        );
    }

    return(
        <div className={`col col-12 col-sm-5 col-md-3 col-lg-3 
            py-1 px-3 m-1 coll-item`}>
            {
            mainState.isSet 
            ? 
            <LazyLoad height={300} offset={10} once>
                <Thumb previewFile={collectionItemState.previewFile}
                    name={anim.name}/>
                <Info anim={anim} />
                <Buttons anim={anim} user={mainState.user}
                    handleDelete={handleDelete} handleView={handleView}
                    handleDownload={handleDownload} isViewerOpen={collectionState.isViewerOpen}/> 
                {
                collectionItemState.viewFile || (collectionItemState.index <= index) 
                ? <Div hidden={true} />
                : <PreviewGen />
                } 
                {
                collectionItemState.viewFile  
                || !isDownloading 
                ? <Div hidden={true}/>
                : <DownloadGen />             
                }
            </LazyLoad>
            : 
            <Div/>
            }
    </div>
    );
}