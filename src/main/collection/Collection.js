import React, { useReducer, useContext, createContext, useEffect, useState } from 'react';
import { CollectionItem } from './item/CollectionItem';
import { Loading } from '../../common/Loading';
import { collectionReducer } from './collectionReducer';
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
import { Button } from 'react-bootstrap';
import { ContactButton } from './components/ContactButton';

const INIT_COLLECTION_STATE = {anims: null, id: false, isSet: false, isBrowse: false,
    contactReqEnabled: true, index: 0, downloaded: 100000, isViewerOpen: false, page: 0,
    selectedAnim: null, previewFiles: [], thumbFiles: [], progressFrame: {max: 0, now: 0}};
export const CollectionContext = createContext(INIT_COLLECTION_STATE);

export const useCollectionContext = () => {
    return useContext(CollectionContext);
}

const apiUrl = process.env.REACT_APP_API_URL;

const Collection = ({browse}) => {

    const {account} = useAccount();
    const splat = useParams()[0];
    
    const getCollection = async (id, isBrowse, access, signal, page) => {
        //console.log(access);
        let url;
        let req = {
            method: 'GET',
            mode: 'cors',
            signal: signal,
            headers: {}
        };
        if(isBrowse){
            url = `${apiUrl}collection/${page}`;
        }else{
            url = `${apiUrl}collection/${id}/${page}`; 
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
            console.error(error);
            return false;
        })
        .then(stream => new Response(stream))
        .then(response => response.json())
        .then(body => body)
        .catch(err => {
            console.error("Error fetching data: getCollection");
            console.error(err);
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
        if(account && account.notices && account.notices.length > 0){
            for(let i = 0; i < account.notices.length; i++){
                if(account.notices[i].type && account.notices[i].type.indexOf('pending-contact') > -1){
                    if(account.notices[i].targetUserid === id){
                        return true;
                    }
                }
            }
        }
        return false;
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
                {
                !account.user || !account.user.isAuth || !account.user.isVerified ||
                collectionState.isOwn || isContact(collectionState.userid) || isContactRequested(collectionState.userid)
                ? 
                <div></div> 
                : 
                <ContactButton />
                }
            </div>
        </div>
        : <div className='container collection-header mt-5 mb-5'>
            <h5>Latest anims</h5>
        </div>

    const PageUp = () => {
        const pageUp = () => {
            setCollectionState({type: 'PAGE', data: collectionState.page+1});
        }
        return(
            <Button 
                type="button"
                variant="outline-primary"
                size="lg"
                text=">" 
                onClick={pageUp} 
            />
        )
    }
    const PageDown = () => {
        const pageDown = () => {
            if(collectionState.page > 0){
                setCollectionState({type: 'PAGE', data: collectionState.page-1});
            }
        }
        return(
            <Button
                type="button"
                variant="outline-primary"
                size="lg"
                text="<" 
                onClick={pageDown}
            />
        )
    }
    
    const collectionItems = collectionState ? collectionState.anims?.map((anim, index) => {
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
                    {/*<CollectionContext.Consumer>
                        {() => {*/}
                            <div className=''>
                                {collectionHeading}
                                <div className='col col-12 collection'>
                                    {collectionItems}
                                    <PageDown />
                                    {`${collectionState.page+1}`}
                                    <PageUp />
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