/**
 * This reducer takes calls from the Animation Controller.
 * The returned state is checked by the updateWithProps function
 * in the P5 sketch. 
 * For CHANGE controls, like penSize, penColor, the sketch updates
 * the anim reducer with the appropriate value.
 * For TRIGGER controls, like like enable, disable, the sketch takes
 * a TRUE value, sends back a FALSE to this reducer (to turn off the switch)
 * and then does an update to the anim reducer. 
 * @param {*} state 
 * @param {*} action 
 * @returns 
 */

export const controlReducer = (state, action) => {
    //console.debug(`controlReducer:${action.type}:${action.data}`);
    switch(action.type){
        case 'DISABLE':{
            return ({...state, disable: action.data});
        }
        case 'ENABLE':{
            return ({...state, enable: action.data});
        }
        case 'ENABLE_SHORTCUTS':{
            return ({...state, shortcutsEnabled : action.data});
        }
        case 'MODE':{
            return ({...state, mode: action.data});
        }
        case 'PC':{
            return ({...state, pc: action.data});
        }
        case 'PS':{
            return ({...state, ps: action.data});
        }
        case 'UNDO':{
            return ({...state, undo: action.data});
        }
        case 'REDO':{
            return ({...state, redo: action.data});
        }
        case 'FRAME_RATE':{
            return ({...state, frate: action.data});
        }
        case 'SAVE_BG':{
            return ({...state, saveBg: action.data});
        }
        case 'DRAW_BG':{
            return ({...state, drawBg: action.data});
        }
        case 'WIPE':{
            return ({...state, wipe: action.data});
        }
        case 'NEXT':{
            return ({...state, next: action.data});
        }
        case 'DOWNLOAD':{
            return ({...state, download: action.data});
        }
        case 'PREVIEW':{
            return ({...state, preview: action.data});
        }
        case 'END_PREVIEW':{
            return ({...state, endPreview: action.data});
        }
        case 'SAVE':{
            return ({...state, save: action.data});
        }
        case 'SEND':{
            return ({...state, send: action.data})
        }
        case 'PRIVACY':{
            return ({...state, privacy: action.data});
        }
        case 'SET_PRIVACY':{
            return ({...state, currentPrivacy: action.data});
        }
        case 'LOGGING_IN':{
            return({...state, loggingIn: action.data});
        }
        case 'ADJUST_BG_OVERLAY':{
            return({...state, bgOpacity: action.data});
        }
        case 'ADJUST_BG_FRAME':{
            return({...state, bgFrameOpacity: action.data})
        }
        case 'NEW_LAYER':{
            return({...state, newLayer: action.data})
        }
        case 'RECORD':{
            let recOn = false;
            let recTrigger = false;
            if(typeof action.data === 'object'){
                recOn = action.data.recOn;
                recTrigger = action.data.recTrigger
            }else{
                recTrigger = action.data;
                recOn = state.recOn;
            }
            return({...state, recOn: recOn, recTrigger: recTrigger})
        }
        default:
            return state;
    }
}