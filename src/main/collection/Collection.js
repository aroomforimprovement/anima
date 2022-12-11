import React, { useReducer, useContext, createContext, useEffect, useState } from 'react';
import { CollectionItem } from './item/CollectionItem';
import { Loading } from '../../common/Loading';
import { collectionReducer, getCollection } from './collectionReducer';
import { useParams } from 'react-router';
import toast from 'buttoned-toaster';
import './collection.scss';
import { SITE } from '../../shared/site';
import { Viewer } from './Viewer';
import { Div } from '../../common/Div';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { preview } from '../create/animation/preview';
import { handleFailedConnection } from '../../common/Toast';
import { useAccount } from '../../shared/account';
import { ContactButton } from './components/ContactButton';
import { PageButtons } from './components/PageButtons';

const INIT_COLLECTION_STATE = {anims: null, id: false, isSet: false, isBrowse: false,
    contactReqEnabled: true, index: 0, downloaded: 100000, isViewerOpen: false, page: 0,
    selectedAnim: null, previewFiles: [], thumbFiles: [], 
    progressFrame: {max: 0, now: 0}};
export const CollectionContext = createContext(INIT_COLLECTION_STATE);

export const useCollectionContext = () => {
    return useContext(CollectionContext);
}

const apiUrl = process.env.REACT_APP_API_URL;

const Collection = ({browse}) => {

    const {account} = useAccount();
    const splat = useParams()[0];
    
    const [collectionState, setCollectionState] = useReducer(collectionReducer, INIT_COLLECTION_STATE); 
    const stateOfCollection = { collectionState, setCollectionState };
    const [isFailed, setIsFailed] = useState(false);

    useEffect(() => {
        const handleFailure = async () => {
            handleFailedConnection(SITE.failed_retrieval_message, true);
        }
        if(isFailed){
            handleFailure();
        }
    },[isFailed]);

    useEffect( () => {
        const controller = new AbortController();
        const signal = controller.signal;
        const setCollectionToState = async (data) => {
            setCollectionState({type: 'SET_COLLECTION', data: data, signal}); 
        }
        
        if(!isFailed && !collectionState?.isSet && account?.isSet){
            const access = account.user ? account.user.access : undefined;
            toast.info({message: "Fetching anima", toastId: 'data_fetch'});
            getCollection(splat, browse, access, signal, collectionState.page)
                .then((response) => {
                    console.dir(response);
                    toast.info({message: "Rendering anima", toastId: 'data_fetch'});
                    if(browse){
                        console.log("browse");
                        setCollectionToState({anims: response, isSet: true, signal});
                    }else{
                        console.log("not browse");
                        setCollectionToState({anims: response.anims, isSet: true,
                            username: response.username, userid: response.userid,
                            isOwn: response.userid === account.user.userid, signal});
                    }
                })
                .catch((error) => {
                    setIsFailed(true);
                    toast.error({message: "Failed to fetch anima", toastId: 'data_fetch'});
                });
        }
        return () => {
            controller.abort();
        }
    },[collectionState?.isSet, account?.isSet, account?.user, browse, splat, isFailed]);

    const collectionHeading = collectionState && collectionState.username
        ? <div className='container collection-header mt-4 mb-4'>
            <div className='row'>
                <h5 className='col col-8'>
                    {collectionState.username}
                </h5>
                <ContactButton />
            </div>
        </div>
        : <div className='container collection-header mt-5 mb-5'>
            <h5>Latest anims</h5>
        </div>

    const collectionItems = collectionState?.anims ? collectionState.anims.map((anim, index) => {
        return <CollectionItem 
            key={index} 
            index={index} 
            anim={anim} 
            previewFile={
                collectionState?.previewFiles 
                && collectionState.previewFiles[index] 
                ? collectionState.previewFiles[index] 
                : undefined
            }
            thumbFile={
                collectionState?.thumbFiles 
                && collectionState.thumbFiles[index]
                ? collectionState.thumbFiles[index]
                : undefined
            } />
    }) : <Loading />

    return(
        <div>
            {account?.isSet && collectionState?.anims 
            ?
            <div>
                <CollectionContext.Provider value={stateOfCollection}>
                    <div>
                        {collectionHeading}
                        <div className='col col-12 collection'>
                            {collectionItems}
                            <div className='row page-btns'>
                                <PageButtons/>
                            </div>
                        </div>
                        {
                        collectionState.isViewerOpen && collectionState.viewFile 
                        ?
                        <Viewer 
                            viewFile={collectionState.viewFile} 
                            anim={collectionState.selectedAnim}
                            name={collectionState.viewFileName}
                        /> 
                        : 
                        <Div/>
                        }
                        {
                        collectionState.isViewerOpen && !collectionState.viewFile 
                        ?
                        <ReactP5Wrapper sketch={preview} anim={collectionState.selectedAnim} index={"temp"}
                            collectionState={collectionState} type={'VIEW'}
                            setCollectionState={setCollectionState} clip={false}
                        /> 
                        : <Div/>
                        }
                    </div>
                </CollectionContext.Provider>
            </div>
            :
            <Loading />}
        </div> 
    );
 
}

export default Collection;