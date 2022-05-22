import { arrayRemove } from "../../utils/utils";

const apiUrl = process.env.REACT_APP_API_URL;



export const addContactRequest = async (userid, username, requsername, requserid, access) => {
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
        console.error("Error fetching data: addContactRequest");
    }).catch((error) => {
        console.error("Error fetching data: addContactRequest");
    })
}

export const collectionReducer = (state, action) => {
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
            const anims = [...state.anims];
            const files = [...state.previewFiles];
            let ind;
            const anim = anims.filter((a, i) => {
                if(a.animid === action.data){
                    ind = i;
                    return true;
                }
                return false;
            });
            const newAnims = arrayRemove(anims, anim[0]);
            files.splice(ind, 1);
            return({...state, anims: [...newAnims], previewFiles: [...files], index:0});
        }
        case 'SET_VIEW_FILE':{
            if(action.data){
                const url = URL.createObjectURL(action.data.blob);
                return({...state, viewFile: url, viewFileName: action.data.name});
            }
            return({...state, viewFile: null, viewFileName: null, selectedAnim: null});
            
        }
        case 'ADD_PREVIEW_FILE':{
            if(action.data){
                const url = URL.createObjectURL(action.data.blob);
                const files = [...state.previewFiles];
                //files[action.data.index] = url;
                files.push(url);
                return({...state, previewFiles: files, index: action.data.index+1})
            }
            return({...state})
        }
        case 'SET_SELECTED_ANIM':{
            return({...state, selectedAnim: action.data});
        }
        case 'SET_VIEWER_OPEN':{
            return({...state, isViewerOpen: action.data});
        }
        case 'SET_INDEX':{
            return({...state, index: action.data})
        }
        case 'DOWNLOADED':{
            return({...state, downloaded: action.data});
        }
        case 'RESET_DOWNLOADED':{
            return({...state, downloaded: 100000});
        }
        default:
            break;
    }
}