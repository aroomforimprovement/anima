import React, { createContext, useReducer, useContext } from 'react';
import { Controller, SaveController } from './partials/Controller';
import { Jumbotron, Modal } from 'reactstrap';
import { Creation } from './partials/Creation';
import { sketch } from '../animator/sketch';
import { values } from '../animator/values';
import { CC, CONTROLS }  from '../animator/controls';


export const ControlContext = createContext(values.initialControlState);

export const useControlContext = () => {
    return useContext(ControlContext);
}

const Create = () => {

    const controlReducer = (state, action) => {
        console.log(action.type+':'+action.data);
        switch(action.type){
            case 'DISABLE':{
                return ({...state, disable: action.data});
            }
            case 'ENABLE':{
                return ({...state, enable: action.data});
            }
            case 'MODE':{
                return ({...state, mode: action.data});
            }
            case 'PC':{
                return ({...state, pc: action.data})
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
                return ({...state, 
                    preview: action.data,
                    });
            }
            case 'END_PREVIEW':{
                return ({...state, endPreview: action.data});
            }
            case 'SAVE':{
                return ({...state, save: action.data});
            }
            default:
                return state;
        }
    }

    const [ controls, dispatch ] = useReducer(controlReducer, values.initialControlState);
    const controlState = { controls, dispatch };

    return(
        <div>
            <ControlContext.Provider value={controlState}>
                <Controller />
                <Jumbotron >
                    <Creation sketch={sketch} />
                </Jumbotron>
                <SaveController />
            </ControlContext.Provider>        
        </div>
    );

}

export default Create;