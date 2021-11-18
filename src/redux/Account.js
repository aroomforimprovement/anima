import { arrayRemove } from "../utils/utils";

const apiUrl = process.env.REACT_APP_API_URL;

export const addContact = async (notice, i, access) => {
    console.log("addContact:");
    console.dir(notice);
    let body = {
        userid: notice.userid,
        thisUsername: notice.username,
        contacts: [
            {
                userid: notice.reqUserid,
                username: notice.reqUsername
            }
        ],
        verb: 'update'
    }
    return fetch(`${apiUrl}collection`, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`,
        }
    })
    .then(response => {
        return response;
    }, error => {
        console.error(error);
    })
    .catch((err) => console.log(err));
}

export const getAccountInfo = async (id, access) => {
    return fetch(`${apiUrl}collection/${id}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }   
    }).then(response => {
        if(response.ok){
            return response.json();
        }else{
            console.dir(response);
        }   
    }, error => {
        console.error("error fetching account info " + error);
    }).catch(err => console.error(err))
}

export const deleteContact = async (contact, userid, username, access) => {
    console.log("deleteContact");
    console.dir(contact);
    let body = {
        userid: userid,
        username: username,
        contacts: [
            {
                userid: contact.userid,
                username: contact.username
            }
        ],
        verb: 'delete'
    }
    return fetch(`${apiUrl}collection`, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        }
    }).then(response => {
        if(response.ok){
            console.log("response ok, contact deleted");
            return response.json();
        }
    }, error => {
        console.error(error);
    }).catch(err => console.error(err));
}

export const deleteNotice = async (notice, i, access) => {
    notice.verb = 'delete';
    return fetch(`${apiUrl}collection`, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(notice),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`,
        }
    })
    .then(response => {
        return response;
    }, error => {
        console.error(error);
    })
    .catch((err) => console.error(err));
}

export const updateDisplayName = async (id, name, access) => {
    return fetch(`${apiUrl}collection`, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify({userid: id, username: name, verb: 'update'}),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
        }
    }).then(response => {
        if(response.ok){
            return response.json();
        }
    }, error => {
        console.error(error);
    }).catch((error) => {
        console.error(error);
    })
}

export const accountReducer = (state, action) => {
    switch(action.type){
        case 'SET_ACCOUNT_INFO':
            console.log('SET_ACCOUNT_INFO: ');
            console.dir(action.data);
            return({...state, 
                userid: action.data.userid,
                username: action.data.username,
                notices: action.data.notices,
                contacts: action.data.contacts,
                isSet: true,
            });
        case 'SET_DISPLAY_NAME':
            
            return ({...state, username: action.data});
        case 'DELETE_NOTICE':{
            let notices = [...state.notices];
            const notice = notices[action.data];
            const newNotices = arrayRemove(notices, notice); 
            return ({...state, notices: newNotices});
        }
        case 'DELETE_CONTACT':{
            let contacts = [...state.contacts];
            const contact = contacts[action.data];
            const newContacts = arrayRemove(contacts, contact);
            return ({...state, contacts: newContacts});
        }
        default:
            break;
    }
}