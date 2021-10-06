import React, { useEffect, useState, useReducer, useContext, createContext } from 'react';
import { CollectionItem } from './partials/CollectionItem';
import { useAuth0 } from '@auth0/auth0-react';
import { Loading } from './partials/Loading';

const apiUrl = process.env.REACT_APP_API_URL;
const INIT_COLLECTION_STATE = {collection: null, id: false, isSet: false};



const Collection = () => {
    const { isAuthenticated, getAccessTokenSilently, } = useAuth0();
    const [access, setAccess] = useState(null);
    const [currentCollection, setCollection] = useState(null);
    const [username, setUsername] = useState(null);
    const [userid, setUserid] = useState(null);
    const [isSet, setIsSet] = useState(false);
    const [isBrowse, setIsBrowse] = useState(false);
    const [isOwn, setIsOwn] = useState(true);

    const addContactRequest = () => {
        //TODO shouldn't get the username from localstorage, 
        //it won't match the displayname - whole thing needs fixin
        const thisUsername = window.localStorage.getItem('username');
        const thisUserid = window.localStorage.getItem('userid');
        console.log("addContactRequest: "+ userid + ":" + username);
        return fetch(`${apiUrl}collection`, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                userid: thisUserid,
                thisUsername: thisUsername,
                notices: [
                    {
                        userid: userid, 
                        username: username, 
                        reqUserid: thisUserid,
                        reqUsername: thisUsername,
                        message: `Hi ${username},\nUser ${thisUsername} wants to add you as a contact.
                            \n`,
                        actions: {
                            accept: thisUserid,
                            reject: false
                        }
                    }
                ],
                verb: 'update'
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
            }
        })
        .then(response => {
            if(response.ok){
                return response;
            }
        }, error => {
            console.error(error);
        })
        .then(response => response.json())
        .then(response => {
            //do something
            console.log("RESPONSE from addContactRequest");
            console.dir(response);
        })
        .catch((error) => {
            console.error(error);
        })

    }

    const handleAddContact = (e) => {
        addContactRequest();
    }
    
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
                    setUsername(response.username);
                    setUserid(response.userid);
                    if(response.userid === window.localStorage.getItem('userid')){
                        setIsOwn(true);
                    }else{
                        setIsOwn(false);
                    }
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


    const collectionItems = currentCollection ? currentCollection.map((anim, i) => {
            return(
                <CollectionItem key={i} anim={anim}/>
                );
        }) :
        <Loading />
    
    const collectionHeading = username
    ? <div className='container collection-header mt-4 mb-4'>
        <div className='row'>
            <h5 className='col'>
                {username}
            </h5>
            {isOwn ? <div></div> : <button className='col col-1 btn btn-sm fa fa-users'
                onClick={handleAddContact}>{'Add as contact'}</button>}
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