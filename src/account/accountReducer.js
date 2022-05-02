import { arrayRemove } from "../utils/utils";

const apiUrl = process.env.REACT_APP_API_URL;

export const addContact = async (notice, i, access) => {
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
        console.warn("Problem fetching data: addContact");
    })
    .catch((err) => console.error("Error fetching data: addContact"));
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
            console.warn("Problem fetching data: getAccountInfo");
            return false;
        }   
    }, error => {
        console.error("Error fetching data: getAccountInfo");
        
    }).catch(err => console.error("Error fetching data: getAccountInfo"));
}

export const deleteAccount = async (userid, access, toast) => {
    return fetch(`${apiUrl}collection/${userid}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${access}`
        }
    }).then((response) => {
        return response;
    }).catch((error) => {
        console.error(`deleteAccount: ${error}`);
    })
}

export const deleteContact = async (contact, userid, username, access) => {
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
        //response handled in calling function
        if(response.ok){
            return response.json();
        }else{
            console.warn("Problem fetching data: deleteContact")
        }
    }, error => {
        console.error(console.error("Error fetching data: deleteContact"));
    }).catch(err => console.error("Error fetching data: deleteContact"));
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
        //response handled in calling function
        return response;
    }, error => {
        console.error("Error fetching data: deleteNotice");
    })
    .catch((err) => console.error("Error fetching data: deleteNotice"));
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
        }else{
            console.warn("Problem fetching data: updateDisplayName");
        }
    }, error => {
        console.error("Error fetching data: updateDisplayName");
    }).catch((error) => {
        console.error("Error fetching data: updateDisplayName");
    })
}

export const accountReducer = (state, action) => {
    switch(action.type){
        case 'SET_ACCOUNT_INFO':
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