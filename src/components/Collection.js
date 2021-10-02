import React, { useEffect, useState, useReducer, useContext, createContext } from 'react';
import { CollectionItem } from './partials/CollectionItem';
import { useAuth0 } from '@auth0/auth0-react';


const apiUrl = process.env.REACT_APP_API_URL;
const INIT_COLLECTION_STATE = {collection: [{"name":"nothing"}], id: false, isSet: false};

const CollectionPreviewContext = createContext({previewFile : null});

export const useCollectionPreviewContext = () => {
    return useContext(CollectionPreviewContext);
}

const Collection = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [access, setAccess] = useState(null);
    const [currentCollection, setCollection] = useState(INIT_COLLECTION_STATE.collection);
    const [isSet, setIsSet] = useState(false);
    const [isBrowse, setIsBrowse] = useState(false);

    const collectionPreviewInitialState = {previewFile: null}
    const collectionPreviewReducer = (state, action) => {
        switch(action.type){
            case 'SET_PREVIEW_FILE':{
                return ({...state, previewFile: action.data});
            }
            default:
                break;
        }
    }
    const [collectionPreviewState, collectionPreviewDispatch] = useReducer(collectionPreviewReducer, collectionPreviewInitialState);

    const collectionReducer = (state, action) => {
        console.log("collectionReducer: " + action.type + ":" + action.data);
        
        const getCollection = (id) => {
            let url;
            if(isBrowse){
                url = `${apiUrl}collection`;
            }else{
                url = `${apiUrl}collection/${id}`;
            }
            return fetch(url, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            .then(response => {
                if(response.ok){
                    return response;
                }else{
                    console.error("response not ok");
                    console.dir(response);
                }
            }, error => {
                console.error("error fetching collection: " + error);
            })
            .then(response => response.json())
            .then(response => {
                console.log("got collection");
                console.dir(response);
                if(isBrowse){
                    setCollection(response);
                }else{
                    setCollection(response.anims);
                }
            })
            .catch(err => console.log(err))
            .finally(response => {
                console.log("finally");
                console.dir(response);
            })
        }

        const getIdFromUrl = (url) => {
            console.log("url="+url);
            if(url.match(/(collection\/)\w+/) && url.match(/(collection\/)\w+/).length > -1){
                console.log("collection page has id");
                const id = url.substring(url.indexOf("collection") + 11, url.length);
                return id;
            }    
            return false;
        }

        switch(action.type){
            case 'SET_ID':{
                const id = getIdFromUrl(window.location.href);
                console.log('SET_ID...' + id);
                return({...state, id: id});
            }
            case 'GET_COLLECTION':{
                getCollection(action.data);
                return (state);
            }
            default:
                break;
        }
        console.log("STATE COLLECTION: ");
        console.dir(state.collection);
    }

    const [collectionState, setCollectionState] = useReducer(collectionReducer, INIT_COLLECTION_STATE); 

    useEffect(() => {
        console.log("IS_AUTHENTICATED: " + isAuthenticated);
        console.log("ID: " + collectionState.id);
        console.log("isSet: " + isSet);
        console.log("isBrowse: " + isBrowse);
        const setAccessToken = async () => {
            setAccess(await getAccessTokenSilently());
        }
        if(!isSet && !isBrowse){
            if(window.location.href.indexOf('browse') > -1){
                setIsBrowse(true);
            }
        } 
        if(isAuthenticated && access && collectionState.id && !isSet){
            console.log("useEffect: isAuthenticated && access && collectionState.id && !isSet");
            setCollectionState({type: 'GET_COLLECTION', data: collectionState.id});
            setIsSet(true);
        }else if(isAuthenticated && access && !isSet && isBrowse){
            console.log("useEffect: isAuthenticated && access && !isSet && isBrowse");
            setCollectionState({type: 'GET_COLLECTION', data: false});
            setIsSet(true);
        }else if(isAuthenticated && access){
            console.log("useEffect: isAuthenticated && access");
            setCollectionState({type: 'SET_ID', data: true});
        }else if(isAuthenticated){
            console.log("useEffect: isAuthenticated");
            setAccessToken();
        }
        
    },[isAuthenticated, getAccessTokenSilently, access, collectionState.id, isSet, collectionState.collection, currentCollection, isBrowse]);


    const collectionItems = currentCollection.map((anim, i) => {
            return(
                <CollectionItem key={i} anim={anim}/>
                );
        }) 
            
        
    return(
        <div className='container'>
            {collectionItems}
        </div>
    );
}

export default Collection;