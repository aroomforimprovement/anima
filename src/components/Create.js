import React, { createContext, useReducer, useContext } from 'react';
import Controller from './partials/Controller';
import { Jumbotron } from 'reactstrap';
import { Creation } from './partials/Creation';
import { sketch } from '../animator/sketch';
import { values } from '../animator/values';
import { CC, CONTROLS }  from '../animator/controls';


const CreateContext = createContext(values.initialControlState);

export const useCreateContext = () => {
    return useContext(CreateContext);
}

const Create = () => {

    const createReducer = (state, action) => {
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
            default:
                return state;
        }
    }

    const [ create, dispatch ] = useReducer(createReducer, values.initialCreateState);
    const providerState = {create, dispatch};

    return(
        <div>
            <Jumbotron >
                <CreateContext.Provider value={providerState}>
                    <Controller />
                    <Creation sketch={sketch} />
                </CreateContext.Provider>
            </Jumbotron>
        </div>
    );

}

export default Create;