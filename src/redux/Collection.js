import { arrayRemove } from "../utils/utils";

const apiUrl = process.env.REACT_APP_API_URL;

export const getCollection = async (id, isBrowse, access, signal) => {
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
    return await fetch(url, req)
    .then(response => {
        if(response.ok){
            return response.json();
        }
    }, error => {
        console.error("error fetching collection: " + error);
    }).catch(err => console.error(err));
}

export const addContactRequest = async (userid, username, requsername, requserid, access) => {
    console.log("addContactRequest: "+ userid + ":" + username);
    return fetch(`${apiUrl}collection`, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify({
            userid: requserid,
            thisUsername: requsername,
            notices: [
                {
                    userid: userid, 
                    username: username, 
                    reqUserid: requserid,
                    reqUsername: requsername,
                    type: 'contact',
                    message: `Hi ${username},\nuser ${requsername} wants to add you as a contact.`,
                    actions: {
                        accept: requserid,
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
            return response.json();
        }else{
            return false;
        }
    }, error => {
        console.error(error);
    }).catch((error) => {
        console.error(error);
    })
}

export const collectionReducer = (state, action) => {
    console.log("collectionReducer: " + action.type + ":" + action.data);

    switch(action.type){
        case 'SET':{
            return({...state, isSet: action.data})
        }
        case 'SET_COLLECTION':{
            return({...state, anims: action.data.anims, username: action.data.username,
                userid: action.data.userid, isOwn: action.data.isOwn, isSet: action.data.isSet});
        }
        case 'SET_CONTACT_REQ_ENABLED':{
            return({...state, contactReqEnabled: action.data});
        }
        case 'DELETE_ANIM':{
            let anims = [...state.anims];
            const anim = anims.filter(a => {return a.animid === action.data});
            const newAnims = arrayRemove(anims, anim[0]);
            return({...state, anims: newAnims});
        }
        case 'SET_INDEX':{
            return({...state, index: action.data})
        }
        default:
            break;
    }
}