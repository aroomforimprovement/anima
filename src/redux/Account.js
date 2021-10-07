const apiUrl = process.env.REACT_APP_API_URL;

export const getAccountInfo = (id, access) => {
    return fetch(`${apiUrl}collection/${id}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }   
    }).then(response => {
        if(response.ok){
            return response.json();
        }
    }, error => {
        console.error("error fetching anim " + error);
    }).catch(err => console.error(err))
}

export const deleteContact = (contact, userid, username, access) => {
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
            return response.json();
        }
    }, error => {
        console.error(error);
    }).catch(err => console.error(err));
}

export const updateDisplayName = (id, name, access) => {
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
        case 'DELETE_NOTICE':
            let notices = [...state.notices]
            notices = notices.splice(action.data, 1);
            return ({...state, notices: notices});
        default:
            break;
    }
}