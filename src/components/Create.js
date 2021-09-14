import React, { createContext, useReducer, useContext } from 'react';
import Controller from './partials/Controller';
import { Jumbotron } from 'reactstrap';
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
        //console.log(action.type+':'+action.data);
        switch(action.type){
            case 'DISABLE':{
                console.log("Disable");
                return ({...state, enabled: false});
            }
            case 'ENABLE':{
                console.log("Enable");
                return ({...state, enabled: true});
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
            default:
                return state;
        }
    }

    const [ controls, dispatch ] = useReducer(controlReducer, values.initialControlState);
    const controlState = { controls, dispatch };
    console.log("CONTROLS in CREATE:");
    console.dir(controls);
    return(
        <div>
            <Jumbotron >
                <ControlContext.Provider value={controlState}>
                    <Controller />
                    <Creation sketch={sketch} />
                </ControlContext.Provider>
            </Jumbotron>
        </div>
    );

}

export default Create;