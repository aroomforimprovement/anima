
//import { ControlContext, useControlContext } from '../components/Create';
import uuid from 'react-uuid';

const apiUrl = process.env.REACT_APP_API_URL;


const getNewAnimId = () => {
    return uuid();
}    
const getTempUserId = (animid) => {
    return "temp_"+animid.substring(0, 19);
}
const getUserId = (animid) => {
    const u = window.localStorage.getItem('userid');
    if(u){
        return u;
    }else{
        return getTempUserId(animid)
    }
}

export const newAnimState = {
    isSet: false,
    enabled: true,
    anim:{
        "animid": getNewAnimId(),
        "userid": getUserId(getNewAnimId()),
        "name": null,
        "type": "animation",
        "created": Date.now(),
        "modified": Date.now(),
        "frate": 8,
        "size": 600,
        "privacy": 0,
        "frames": [],
    },
    undos:[],
    redos:[],
    undid:[],
    redid:[],
    bg:[],
    lastFrame:[],
    fid: 0,
    isPreviewOpen: false,
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
    
    const saveAnimToAccount = (a) => {
        console.log("saveAnimToAccount:");
        console.dir(a);
        return fetch(`${apiUrl}anim`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(a),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if(response.ok){ return response;
            }else{ 
                //dispatch({type: 'setSaveFailed', data: true});
                console.error("response not ok") }
        }, error => { 
            //dispatch({type: 'setSaveFailed', data: true});
            console.error("error fetching login");
         }
        )
        .then(response => response.json())
        .then(response => {   
            //dispatch({type: 'setSave', data: response})
        }
        ).catch(error => { console.error(error)})
        .finally(response =>{ 
            //dispatch({type: 'setIsSaved', data: true})
        });
    }
    console.log(action.type+':'+action.data);
    
    switch(action.type){
        case 'SET_ANIM':{
            return ({...state, anim: action.data, isSet: true});
        }
        case 'INIT_ANIM':{
            return ({...state, anim: action.data})
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
                redid: [], undid:[], redos: newRedos });
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
            const bg = state.undos.length > 0 ? [...state.undos] : [];
            console.dir(bg)
            return ({...state, bg: bg});
        }
        case 'DRAW_BG':{
            return ({...state, undos: [], redos: [], undid: [], redid: []});
        }
        case 'WIPE':{
            return ({...state, redos: [], undos: [], redid:[], undid:[]});
        }
        case 'NEXT':{
            const points = state.undos.length > 0 ? [...state.undos] : [];
            const fid = state.fid; 
            const newFid = state.fid + 1;
            const animid = state.animid ? state.animid : '1234567890';
            const bg = state.bg;
            const frame = {fid: fid, animid: animid, points: points, bg: bg};
            const lastFrame = fid > 0 ? state.anim[fid-1] : null;
            return ({...state, 
                anim:{...state["anim"],
                frames: [...state["anim"]["frames"], frame]},
                undos: [], redos: [], undid: [], redid: [], fid: newFid,
                lastFrame: lastFrame,
            });
        }
        case 'PREVIEW':{
            return({...state,
                isPreviewOpen: true});
        }
        case 'END_PREVIEW':{
            return({...state,
                isPreviewOpen: false, enabled: true});
        }
        case 'PLAY_PREVIEW':{
            return ({...state, 
                previewFile: URL.createObjectURL(action.data.blob), 
                previewName: action.data.name
            });
        }
        case 'NAME':{
            return ({...state,
                anim: {...state["anim"], name: action.data}})
        }
        case 'SAVE':{
            return ({...state, enabled: false, isSaveOpen: true});
        }
        case 'SAVE_TO_ACCOUNT':{
            saveAnimToAccount(state.anim);
            return ({...state, enabled: true, isSaveOpen: false});
        }
        case 'CANCEL_SAVE':{
            return({...state, enabled: true, isSaveOpen: false});
        }
        default:
            console.log("reached DEFAULT");
            return state;
    }
}