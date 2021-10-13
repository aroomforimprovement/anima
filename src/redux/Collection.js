const apiUrl = process.env.REACT_APP_API_URL;

export const getCollection = (id, isBrowse, access) => {
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
            return response.json();
        }
    }, error => {
        console.error("error fetching collection: " + error);
    }).catch(err => console.error(err));
}

export const addContactRequest = (userid, username, requsername, requserid, access) => {
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
        }
    }, error => {
        console.error(error);
    }).catch((error) => {
        console.error(error);
    })
}

export const collectionReducer = (state, action) => {
    console.log("collectionReducer: " + action.type + ":" + action.data);


    const getIdFromUrl = (url) => {
        //console.log("url="+url);
        if(url.match(/(collection\/)\w+/) && url.match(/(collection\/)\w+/).length > -1){
            //console.log("collection page has id");
            const id = url.substring(url.indexOf("collection") + 11, url.length);
            return id;
        }    
        return false;
    }

    switch(action.type){
        case 'SET_ID':{
            const id = getIdFromUrl(window.location.href);
            //console.log('SET_ID...' + id);
            return({...state, id: id});
        }
        case 'SET_COLLECTION':{
            return({...state, anims: action.data.anims, username: action.data.username,
                userid: action.data.userid, isOwn: action.data.isOwn, isSet: action.data.isSet});
        }
        case 'SET_CONTACT_REQ_ENABLED':{
            return({...state, contactReqEnabled: action.data});
        }
        case 'SET_IS_BROWSE':{
            return ({...state, isBrowse: action.data})
        }
        default:
            break;
    }
}