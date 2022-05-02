import React, { useReducer, useContext, createContext, useEffect, useState } from 'react';
import { CollectionItem } from './item/CollectionItem';
import { Loading } from '../common/Loading';
import { useMainContext } from '../main/Main';
import { collectionReducer, addContactRequest, getCollection } from './collectionReducer';
import { useParams } from 'react-router';
import toast from 'buttoned-toaster';
import './collection.css';
import { SITE } from '../shared/site';
import { Viewer } from './Viewer';
import { Div } from '../common/Div';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { preview } from '../create/animation/preview';
import { handleFailedConnection } from '../common/Toast';

const INIT_COLLECTION_STATE = {anims: null, id: false, isSet: false, isBrowse: false, 
    contactReqEnabled: true, index: 0, downloaded: 100000, isViewerOpen: false,
    selectedAnim: null, progressFrame: {max: 0, now: 0}};
const CollectionContext = createContext(INIT_COLLECTION_STATE);

export const useCollectionContext = () => {
    return useContext(CollectionContext);
}

const Collection = ({browse}) => {

    const { mainState, mainDispatch } = useMainContext();
    const splat = useParams()[0];
    
    const isContact = (id) => {
        if(mainState && mainState.contacts){
                for(let i = 0; i < mainState.contacts.length; i++){
                    if(mainState.contacts[0].userid === id){
                        return true;
                    }
                }
                return false;
        }
        return false;
    }
    const isContactRequested = (id) => {
        if(mainState && mainState.notices){
            for(let i = 0; i < mainState.notices.length; i++){
                if(mainState.notices[i].type.indexOf('pending-contact') > -1){
                    if(mainState.notices[i].targetUserid === id){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const handleAddContact = (e) => {
        const approve = (id) => {
            addContactRequest(collectionState.userid, collectionState.username, 
                mainState.user.username, mainState.user.userid, mainState.user.access)
                .then((response) => {
                    //should check and set this on page load as well - would have to retrieve contacts and notices from target collection on fetch
                    setCollectionState({type: 'SET_CONTACT_REQ_ENABLED', data: false});
                    if(response){
                        toast.success("Contact request sent");
                    }else{
                        toast.error("Error sending contact request");
                    }
                });
            toast.dismiss(id);
        }

        const dismiss = (id) => {
            toast.dismiss(id);
        }     

        toast.info( 
            {
                approveFunc: approve, 
                dismissFunc: dismiss,
                message: `You are about to send a contact request to ${collectionState.username}. 
                    After they approve the request, you will be able view all of eachother's anims,
                     even the ones marked Private`,
                approveTxt: "Send Contact Request", 
                dismissTxt: "Maybe later"
            }
        );
    }
    
    const [collectionState, setCollectionState] = useReducer(collectionReducer, INIT_COLLECTION_STATE); 
    const stateOfCollection = { collectionState, setCollectionState };
    const [isFailed, setIsFailed] = useState(false);
    
    useEffect(() => {
        const handleFailure = async () => {
            handleFailedConnection(SITE.failed_retrieval_message, true, toast);
            console.error(SITE.failed_connection_message)
        }
        if(isFailed){
            handleFailure();
        }
    },[isFailed] )

    useEffect( () => {
        const controller = new AbortController();
        const signal = controller.signal;
        const setCollection = async (data) => {
            setCollectionState({type: 'SET_COLLECTION', data: data, signal}); 
        }
        
        if(!isFailed && !collectionState.isSet && mainState.isSet){
            const access = mainState.user ? mainState.user.access : undefined
            toast.info("Fetching anima");
            getCollection(splat, browse, access, signal)
                .then((response) => {
                    toast.info("Rendering anima");
                    if(browse){
                        setCollection({anims: response, isSet: true, signal});
                    }else{
                        setCollection({anims: response.anims, isSet: true,
                            username: response.username, userid: response.userid,
                            isOwn: response.userid === mainState.user.userid, signal});
                    }
                })
                .catch((error) => {
                    setIsFailed(true, signal);
                    toast.error("Failed to fetch anima");
                });
        }
        return () => {
            controller.abort();
        }
    },[collectionState.isSet, mainState.isSet, browse, mainState.user, splat, isFailed]);

    const collectionHeading = collectionState.username
        ? <div className='container collection-header mt-4 mb-4'>
            <div className='row'>
                <h5 className='col col-8'>
                    {collectionState.username}
                </h5>
                {
                !mainState.user || !mainState.user.isAuth || !mainState.user.isVerified ||
                collectionState.isOwn || isContact(collectionState.userid) || isContactRequested(collectionState.userid)
                ? 
                <div></div> 
                : 
                <button className='col btn btn-outline-light btn-sm fa fa-users'
                    onClick={handleAddContact} hidden={!collectionState.contactReqEnabled}>{'Add as contact'}
                </button>
                }
            </div>
        </div>
        : <div className='container collection-header mt-5 mb-5'>
            <h5>Latest anims</h5>
        </div>

    const [collection, setCollection] = useState([]);

    useEffect(() => {
        if(collectionState.anims){
            if(collectionState.anims.length >= collectionState.index){
                const col = collectionState.anims.slice(0, collectionState.index+1);
                setTimeout(() => {
                    setCollection(col);
                }, 100)
                 
            }
        }
    }, [collectionState.anims, collectionState.index]);

    const collectionItems = collection ? collection.map((anim, index) => {
        return(
            <CollectionItem key={index} index={index} anim={anim}/>
        );
    }) : <Loading />


    return(
        <div>
            {mainState.isSet && collectionState.anims 
            ?
            <div>
                <CollectionContext.Provider value={stateOfCollection}>
                    {/*<CollectionContext.Consumer>*/}
                        {/*{() => {*/}
                            <div className='container'>
                                {collectionHeading}
                                <div className='col col-12'>
                                    {collectionItems}
                                </div>
                                {collectionState.isViewerOpen && collectionState.viewFile 
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
                                    mainDispatch={mainDispatch}/> 
                                : <Div/>
                                }
                            </div>
                        {/*}}*/}
                    {/*</CollectionContext.Consumer>*/}
                </CollectionContext.Provider>
            </div>
            :
            <Loading />}
        </div> 
    );
 
}

export default Collection;