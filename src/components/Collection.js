import React, { useReducer, useContext, createContext, useEffect } from 'react';
import { CollectionItem } from './partials/CollectionItem';
import { Loading } from './partials/Loading';
import { useMainContext } from './Main';
import { collectionReducer, addContactRequest, getCollection } from '../redux/Collection';
import { useParams } from 'react-router';
const INIT_COLLECTION_STATE = {anims: null, id: false, isSet: false, isBrowse: false, contactReqEnabled: true, index: 0};
const CollectionContext = createContext(INIT_COLLECTION_STATE);

export const useCollectionContext = () => {
    return useContext(CollectionContext);
}

const Collection = ({browse}) => {
   
    const { mainState } = useMainContext();
    const splat = useParams()[0];
    
    
    const isContact = (id) => {
        if(mainState && mainState.contacts){
                for(let i = 0; i < mainState.contacts.length; i++){
                    if(mainState.contacts[0].userid === id){
                        console.log("isContact:TRUE");
                        return true;
                    }
                }
                console.log('isContact:FALSE');
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
        addContactRequest(collectionState.userid, collectionState.username, 
            mainState.user.username, mainState.user.userid, mainState.user.access)
            .then((response) => {
                //should check and set this on page load as well - would have to retrieve contacts and notices from target collection on fetch
                setCollectionState({type: 'SET_CONTACT_REQ_ENABLED', data: false})
            });
    }
    

    const [collectionState, setCollectionState] = useReducer(collectionReducer, INIT_COLLECTION_STATE); 
    const stateOfCollection = { collectionState, setCollectionState };

    

    useEffect( () => {
        console.log("mounted");
        const controller = new AbortController();
        const signal = controller.signal;
        const setCollection = async (data) => {
            console.log("setCollection");
            setCollectionState({type: 'SET_COLLECTION', data: data}); 
        }
        if(!collectionState.isSet && mainState.isSet){
            const access = mainState.user ? mainState.user.access : undefined
            getCollection(splat, browse, access, signal)
                .then((response) => {
                    if(browse){
                        setCollection({anims: response, isSet: true});
                    }else{
                        setCollection({anims: response.anims, isSet: true,
                            username: response.username, userid: response.userid,
                            isOwn: response.userid === mainState.user.userid});
                    }
                }).catch((error) => {console.error(error)});
        }
        return () => {
            console.log("cleanup");
            controller.abort();
        }
    },[collectionState.isSet, mainState.isSet, browse, mainState.user, splat]);


    const collectionItems = collectionState.anims ? collectionState.anims.map((anim, index) => {
        return(
            <CollectionItem key={index} index={index} anim={anim}/>
            );
    }) : <Loading />
    
    const collectionHeading = collectionState.username
    ? <div className='container collection-header mt-4 mb-4'>
        <div className='row'>
            <h5 className='col col-8'>
                {collectionState.username}
            </h5>
            {
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
        
    return(
        <div>
            {mainState.isSet && collectionState.anims ?
            <CollectionContext.Provider value={stateOfCollection}>
                <CollectionContext.Consumer>
                    {() => (
                    <div className='container'>
                        {collectionHeading}
                        <div className='col col-12 collection'>
                            {collectionItems}
                        </div>
                    </div>  
                    )}
                </CollectionContext.Consumer>
            </CollectionContext.Provider>
            :
            <Loading />}
        </div> 
    );
}

export default Collection;