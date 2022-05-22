import React, { useState, useReducer } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { preview } from "../../create/animation/preview";
import LazyLoad from "react-lazyload";
import { CollectionContext, useCollectionContext } from "../Collection";
import toast from "buttoned-toaster";
import { collectionItemReducer, deleteAnim } from './collectionItemReducer';
import { Thumb } from "./Thumb";
import { Buttons } from "./Buttons";
import { Info } from "./Info";
import { Div } from "../../../common/Div";
import { saveAs } from "file-saver";
import { Loading } from "../../../common/Loading";
import { useAccount } from "../../../shared/account";

const collectionItemInitialState = {viewFile: null, viewName: null, 
    previewFile: null, previewName: null, hidden: false, deleted: false,
    progressFrame: {max: 0, now: 0}
}

export const CollectionItem = ({anim, index, previewFile}) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const { collectionState, setCollectionState } = useCollectionContext();
    const [collectionItemState, collectionItemDispatch] = useReducer(collectionItemReducer, collectionItemInitialState);
    const {account} = useAccount();

    const handleView = async (e) => {
        toast.info({message: "Rendering anim"});
        setTimeout(() => {
            setCollectionState({type: 'SET_SELECTED_ANIM', data: anim});
            setCollectionState({type: 'SET_VIEWER_OPEN', data: true})    
        }, 100);
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
            deleteAnim(anim.animid, account.user)
            .then((res) => {
                if(res){
                    toast.success("Anim deleted");
                    //collectionItemDispatch({type: 'DELETE_ANIM', data:anim.animid});

                    setCollectionState({type: 'DELETE_ANIM', data: anim.animid});
                }else{
                    toast.error("Error deleting the anim");
                }
            })
            .catch((err) => {
                console.error("Error fetching data: deleteAnim");
            })
            if(id) toast.dismiss(id);
        };
        const dismiss = (id) => {
            toast.dismiss(id);
        } 

        if(window.localStorage.getItem(`dontshow_DELETE_ANIM_${account.user.userid}`)){
            approve();
        }else{
            toast.warn(
                {
                    approveFunc: approve,
                    dismissFunc: dismiss,
                    message:`Are you sure you want to permanently delete anim \n"${anim.name}"`,
                    approveTxt: "Delete", 
                    dismissTxt: "Cancel",
                    canHide: true,
                    dontShowType: `DELETE_ANIM_${account.user.userid}`
                }
            );
        }
        
    }

    const RenderWrapper = ({anim, index, id, type, clip}) => {
        return(
            <div>
                <ReactP5Wrapper sketch={preview} anim={anim} index={index} id={id}
                        collectionItemDispatch={collectionItemDispatch}
                        collectionState={collectionState} type={type}
                        setCollectionState={setCollectionState} 
                        clip={clip}/>
            </div>
        );
    }

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
        <CollectionContext.Consumer >
            {() => (
            <div className={`col col-12 col-sm-5 col-md-4 col-lg-3 col-xl-3 col-xxl-2
                py-1 px-3 my-2 mx-1 coll-item`}>
                {
                account.isSet 
                ? 
                <LazyLoad 
                    height={300} 
                    offset={100} 
                    placeholder={<Loading/>}
                    style={{minHeight:'100%'}}
                    unmountIfInvisible={true}
                    once={true}>
                    <Thumb previewFile={previewFile}
                        name={anim.name}/>
                    <div className="coll-item-body">
                        <Info anim={anim} />
                        <Buttons 
                            anim={anim} 
                            user={account.user}
                            handleDelete={handleDelete} 
                            handleView={handleView}
                            handleDownload={handleDownload} 
                            isViewerOpen={collectionState.isViewerOpen}
                        /> 
                    </div>
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
                <Loading/>
                }
            </div>
            )}
        </CollectionContext.Consumer>
    );
}