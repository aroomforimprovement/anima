import toast from 'buttoned-toaster';
import { v4 as uuidv4 } from 'uuid';

const apiUrl = process.env.REACT_APP_API_URL;


const getNewAnimId = () => {
    return uuidv4();
}    
const getTempUserId = (animid) => {
    return "temp_"+animid.substring(0, 19);
}
const getUserId = (userid, animid) => {
    if(userid){
        return userid;
    }else{
        return getTempUserId(animid)
    }
}
const getTempUsername = () => {
    return "Unknown";
}
const getUsername = (username) => {
    if(username){
        return username;
    }else{
        return getTempUsername();
    }
}

export const newAnimState = (user) => {
    const animid = getNewAnimId();
    const userid = getUserId(user ? user.userid : false, getNewAnimId());
    return {
        isSet: false,
        enabled: true,
        anim:{
            "animid": animid,
            "userid": userid,
            "username": getUsername(user ? user.username : false),
            "name": null,
            "type": "animation",
            "created": Date.now(),
            "modified": Date.now(),
            "frate": 8,
            "size": 600,
            "privacy": 0,
            "frames": [],
            "lastFrame":{},
        },
        undos:[],
        redos:[],
        undid:[],
        redid:[],
        bg:[],
        fid: 0,
        isPreviewOpen: false,
        isSaveOpen: false,
        isWiped: true,
    }
}

/**
 * animReducer maintains the state of the anim object and 
 * extra state used during creation.
 * Generally, the sketch updateWithProps checks for changes
 * in control state and relays them to this reducer to affect
 * changes to anim state.
 * @param {*} state 
 * @param {*} action 
 * @returns 
 */
export const animReducer = (state, action) => {
    //save anim and send to auth
    //console.log(action.type)
    //console.dir(action.data)
    //console.dir(state)
    const saveTempAnim = async (anim) => {
        window.localStorage.setItem("tempAnim", JSON.stringify(anim));
        return anim.id;
    }

    const saveAnimToAccount = async (anim, access) => {
        return fetch(`${apiUrl}anim`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(anim),
            headers: {
                Authorization: `Bearer ${access}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if(response.ok){ 
                toast.success("Anim saved to account");
                return true;
            }else{ 
                console.error("response not ok") }
                return false;
        }, error => { 
            console.error("error saving anim");
            return false;
        })
        .catch(error => { 
            toast.error("Error saving anim to account");
            console.error(error)
            return false;
        });
    }
    
    //console.debug(`animReducer:${action.type}:${action.data}`);
    switch(action.type){    
        case 'SET_ANIM':{
            return ({...state, anim: action.data, isSet: true, temp: false});
        }
        case 'SET_TEMP':{
            return({...state, temp: action.data});
        }
        case 'INIT_ANIM':{
            return ({...state, anim: action.data})
        }
        case 'UPDATE_ANIM_USER':{
            let anim = {...state.anim};
            anim.userid = action.data.userid;
            anim.username = action.data.username;
            return ({...state, anim});
        }
        case 'ENABLED':{
            return ({...state, enabled: action.data})
        }
        case 'DO_STROKE':{
            let newUndos = [...state.undos];
            let newRedos = [...state.redos];
            let isSameAsPrevious = newUndos[newUndos.length-1] === action.data;
            if(!isSameAsPrevious){
                newUndos.push(action.data);
            }
            if(state.undid.length > 0){
                newRedos = [];
            }
            return ({...state, undos: newUndos, 
                redid: [], undid:[], redos: newRedos, isWiped: false });
        }
        case 'UNDO_STROKE':{
            let newRedos = [...state.redos];
            let newUndos = [...state.undos];
            const undid = newUndos.pop();
            if(undid){
                newRedos.push(undid);
            }
            return ({ ...state, 
                redos: newRedos, undos: newUndos, 
                undid: undid ? undid : [], redid: []});
        }
        case 'REDO_STROKE':{
            let newRedos = [...state.redos];
            let newUndos = [...state.undos];
            const redid = newRedos.pop();
            if(redid){
                newUndos.push(redid);
            }
            return ({ ...state, 
                redos: newRedos, undos: newUndos,
                undid: [], redid: redid ? redid : []});
        }
        case 'FRATE':{
            return ({...state, "anim": {...state["anim"], frate: action.data}});
        }
        case 'SAVE_BG':{
            let bg = [];
            if(action.data){
                if(state.isWiped){
                    bg = action.data;
                }else{
                    bg = [...state.bg]?.concat(action.data);
                }
            }else{
                if(state.isWiped){
                    bg = state.undos.length > 0 ? [...state.undos] : [];
                }else{
                    bg = state.undos.length > 0 ? [...state.bg]?.concat([...state.undos]) : [...state.bg];
                }
                
            } 
            //console.dir(bg)
            return ({...state, bg: bg});
        }
        case 'DRAW_BG':{
            return ({...state, undos: [], redos: [], undid: [], redid: [], isWiped: false});
        }
        case 'WIPE':{
            return ({...state, redos: [], undos: [], redid:[], undid:[], isWiped: true});
        }
        case 'NEXT':{
            const points = state.undos.length > 0 ? [...state.undos] : [];
            const fid = state.fid; 
            const newFid = state.fid + 1;
            const bg = state.bg;
            const frame = {fid: fid, points: points, bg: bg};
            const lastFrame = frame;
            return ({...state, 
                anim:{...state["anim"], lastFrame: lastFrame,
                frames: [...state["anim"]["frames"], frame]},
                undos: [], redos: [], undid: [], redid: [], fid: newFid,
            });
        }
        case 'PREVIEW':{
            //console.log("Creation: PREVIEW");
            return({...state,
                isPreviewOpen: true});
        }
        case 'END_PREVIEW':{
            return({...state,
                isPreviewOpen: false, enabled: true});
        }
        case 'SET_PREVIEW_FILE':{
            return ({...state, 
                previewFile: URL.createObjectURL(action.data.blob), 
                previewName: action.data.name
            });
        }
        case 'SET_VIEW_FILE':{
            return({...state, 
                viewFile: URL.createObjectURL(action.data.blob),
                viewName: action.data.name
            });     
        }
        case 'NAME':{
            return ({...state,
                anim: {...state["anim"], name: action.data}})
        }
        case 'SAVE':{
            let anim = {...state.anim};
            anim.size = action.data.size; 
            return ({...state, enabled: false, isSaveOpen: true, anim: anim});
        }
        case 'SAVE_TO_ACCOUNT':{
            //console.debug('SAVE_TO_ACCOUNT');
            let temp = false;
            if(!action.data && !window.localStorage.getItem('tempAnim')){
                saveTempAnim(state.anim);
                temp = state.anim.animid;
            }else if(action.data){
                let anim = {...state.anim};
                anim.size = action.data;
                saveAnimToAccount(state.anim, action.data);
            }
            return ({...state, enabled: true, isSaveOpen: false, temp: temp, saveClose: true});    
        }
        case 'CANCEL_SAVE':{
            return({...state, enabled: true, isSaveOpen: false, saveClose: true});
        }
        case 'SET_SAVE_OPEN':{
            return({...state, enabled: !action.data, isSaveOpen: action.data})
        }
        case 'SAVE_CLOSE':{
            return({...state, saveClose: action.data});
        }
        case 'PRIVACY':{
            return({...state, anim:{...state["anim"],
                privacy: action.data}})
        }
        case 'USERID':{
            return({...state, anim:{...state["anim"],
                userid: state.anim.userid}})
        }
        default:
            //console.log("reached DEFAULT");
            return state;
    }
}