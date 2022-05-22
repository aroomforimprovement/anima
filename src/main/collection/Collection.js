import React, { useReducer, useContext, createContext, useEffect, useState } from 'react';
import { CollectionItem } from './item/CollectionItem';
import { Loading } from '../../common/Loading';
import { collectionReducer, addContactRequest } from './collectionReducer';
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

const INIT_COLLECTION_STATE = {anims: null, id: false, isSet: false, isBrowse: false, 
    contactReqEnabled: true, index: 0, downloaded: 100000, isViewerOpen: false,
    selectedAnim: null, previewFiles: [], thumbFiles: [], progressFrame: {max: 0, now: 0}};
export const CollectionContext = createContext(INIT_COLLECTION_STATE);

export const useCollectionContext = () => {
    return useContext(CollectionContext);
}

const apiUrl = process.env.REACT_APP_API_URL;

const Collection = ({browse}) => {

    const {account} = useAccount();
    const splat = useParams()[0];
    
    const getCollection = async (id, isBrowse, access, signal) => {
        let url;
        let req = {
            method: 'GET',
            mode: 'cors',
            signal: signal,
            headers: {}
        };
        if(isBrowse){
            url = `${apiUrl}collection`;
        }else{
            url = `${apiUrl}collection/${id}`; 
        }
        if(access){
            req.headers = {
                Authorization: `Bearer ${access}`
            }
        }
        return fetch(url, req)
        .then(response => {
            if(response.ok){
                const reader = response.body.getReader();
                return new ReadableStream({
                    start(controller){
                        const pump = () => {
                            return reader.read().then(({done, value}) => {
                                if(done){
                                    controller.close();
                                    return;
                                }
                                controller.enqueue(value);
                                return pump();
                            });
                        }
                        return pump();
                    }
                })
            }
        }, error => {
            console.error("Error fetching data: getCollection");
            return false;
        })
        .then(stream => new Response(stream))
        .then(response => response.json())
        .then(body => body)
        .catch(err => {
            console.error("Error fetching data: getCollection");
            return false;
        });
    }
    
    const isContact = (id) => {
        if(account && account.contacts){
                for(let i = 0; i < account.contacts.length; i++){
                    if(account.contacts[0].userid === id){
                        return true;
                    }
                }
                return false;
        }
        return false;
    }

    const isContactRequested = (id) => {
        if(account && account.notices){
            for(let i = 0; i < account.notices.length; i++){
                if(account.notices[i].type.indexOf('pending-contact') > -1){
                    if(account.notices[i].targetUserid === id){
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
                account.user.username, account.user.userid, account.user.access)
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
        
        if(!isFailed && !collectionState?.isSet && account?.isSet){
            const access = account.user ? account.user.access : undefined
            toast.info({message: "Fetching anima", toastId: 'data_fetch'});
            getCollection(splat, browse, access, signal)
                .then((response) => {
                    toast.info({message: "Rendering anima", toastId: 'data_fetch'});
                    if(browse){
                        setCollection({anims: response, isSet: true, signal});
                    }else{
                        setCollection({anims: response.anims, isSet: true,
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
                {
                !account.user || !account.user.isAuth || !account.user.isVerified ||
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
        if(collectionState?.anims){
            if(collectionState.anims.length > collectionState.index){
                const col = collectionState.anims.slice(0, collectionState.index+1);
                setTimeout(() => {
                    setCollection(col); 
                }, 100)
                 
            }
        }
    }, [collectionState?.anims, collectionState?.index]);

    const [thumbFiles, setThumbFiles] = useState();

    useEffect(() => {
        if(collectionState?.thumbFiles){
            setThumbFiles(collectionState.thumbFiles);
        }
    }, [collectionState?.thumbFiles]);

    const [previewFiles, setPreviewFiles] = useState();

    useEffect(() => {
        if(collectionState?.previewFiles){
            setPreviewFiles(collectionState.previewFiles);
        }
    }, [collectionState?.previewFiles]);

    
    const collectionItems = collection ? collection.map((anim, index) => {
        return <CollectionItem 
            key={index} 
            index={index} 
            anim={anim} 
            previewFile={
                previewFiles 
                && previewFiles[index] 
                ? previewFiles[index] 
                : undefined
            }
            thumbFile={
                thumbFiles 
                && thumbFiles[index]
                ? thumbFiles[index]
                : undefined
            } />
    }) : <Loading />

    useEffect(() => {

    }, [collection])

    return(
        <div>
            {account?.isSet && collectionState?.anims 
            ?
            <div>
                <CollectionContext.Provider value={stateOfCollection}>
                    {/*<CollectionContext.Consumer>
                        {() => {*/}
                            <div className=''>
                                {collectionHeading}
                                <div className='col col-12 collection'>
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
                                    /> 
                                : <Div/>
                                }
                            </div>
                        {/*}}
                    </CollectionContext.Consumer>*/}
                </CollectionContext.Provider>
            </div>
            :
            <Loading />}
        </div> 
    );
 
}

export default Collection;