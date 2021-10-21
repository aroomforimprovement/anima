import React, { useEffect, useReducer } from 'react';
import { CollectionItem } from './partials/CollectionItem';
import { Loading } from './partials/Loading';
import { useMainContext } from './Main';
import { collectionReducer, addContactRequest, getCollection, getIdFromUrl } from '../redux/Collection';

const INIT_COLLECTION_STATE = {anims: null, id: false, isSet: false, isBrowse: false, contactReqEnabled: true};


const Collection = ({browse}) => {
    const { mainState } = useMainContext();

    //contacts isn't a part of collection here, this won't work
    const isContact = (id) => {
        if(collectionState && collectionState.collection 
            && collectionState.collection.contacts){
                for(let i = 0; i < collectionState.collection.contacts.length; i++){
                    if(collectionState.collection.contacts[i].userid === id){
                        console.log("isContact:TRUE");
                        return true;
                    }
                }
                return false;
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
    console.log("collectionState");
    console.dir(collectionState);
    console.log("mainState");
    console.dir(mainState);
    
    useEffect(() => {
        if(mainState.user){
            console.log("IS_AUTHENTICATED: " + mainState.user.isAuth);
            console.log("ACCESS: " + mainState.user.access);
        }
        console.log("ID: " + collectionState.id);
        console.log("isSet: " + collectionState.isSet);
        console.log("isBrowse: " + collectionState.isBrowse);
        
        if(!collectionState.isSet && !collectionState.isBrowse){
            if(browse){
                setCollectionState({type: 'SET_IS_BROWSE', data: true});
            }
        }
        if(mainState.user && mainState.user.isAuth && mainState.user.access && collectionState.id && !collectionState.isSet){
            getCollection(collectionState.id, collectionState.isBrowse, mainState.user.access)
                .then((response) => {
                    if(collectionState.isBrowse){
                        setCollectionState({type: 'SET_COLLECTION', data: {anims: response, isSet: true}});
                    }else{
                        setCollectionState({type: 'SET_COLLECTION', data: {anims: response.anims,
                            username: response.username, userid: response.userid,
                            isOwn: response.userid === mainState.user.userid, isSet: true}});
                    }
                });
        }else if(mainState.user && mainState.user.isAuth && mainState.user.access && !collectionState.isSet && collectionState.isBrowse){
            getCollection(false, collectionState.isBrowse, mainState.user.access)
                .then((response) => {
                    setCollectionState({type: 'SET_COLLECTION', data: {anims: response, isSet: true}});
                });
        }else if(mainState.user && mainState.user.isAuth && mainState.user.access){
            setCollectionState({type: 'SET_ID', data: true});
        }else if(mainState.user && !collectionState.isBrowse &&  !mainState.user.isAuth && !collectionState.isSet){
            const id = getIdFromUrl(window.location.href);
            getCollection(id, collectionState.isBrowse, false)
                .then((response) => {
                    setCollectionState({type: 'SET_COLLECTION', data: {anims: response.anims, isSet: true}});
                });
        }else if(collectionState.isBrowse  && !collectionState.isSet){
            getCollection(false, collectionState.isBrowse, false)
                .then((response) => {
                    setCollectionState({type: 'SET_COLLECTION', data: {anims: response, isSet: true}});
                })
        }
    },[collectionState.id, collectionState.anims, mainState.user, collectionState.isBrowse, collectionState.isSet, browse]);


    const collectionItems = collectionState.anims ? collectionState.anims.map((anim, i) => {
            return(
                <CollectionItem key={i} anim={anim}/>
                );
        }) :
        <Loading />
    
    const collectionHeading = collectionState.username
    ? <div className='container collection-header mt-4 mb-4'>
        <div className='row'>
            <h5 className='col col-8'>
                {collectionState.username}
            </h5>
            {
            collectionState.isOwn || isContact(collectionState.userid) 
            ? 
            <div></div> 
            : 
            <button className='col btn btn-outline-light btn-sm fa fa-users'
                onClick={handleAddContact} enabled={mainState.contactReqEnabled}>{'Add as contact'}
            </button>
            }
        </div>
    </div>
    : <div></div>
        
    return(
        <div className='container'>
                {collectionHeading}
            <div className='col col-12 collection'>
                {collectionItems}
            </div>
        </div>
    );
}

export default Collection;