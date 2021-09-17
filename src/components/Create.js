import React, { createContext, useReducer, useContext } from 'react';
import { Controller, SaveController } from './partials/Controller';
import { Jumbotron } from 'reactstrap';
import { Creation } from './partials/Creation';
import { values } from '../animator/values';
import { controlReducer } from '../redux/Create';

export const ControlContext = createContext(values.initialControlState);

export const useControlContext = () => {
    return useContext(ControlContext);
}

const Create = () => {

    const [ controls, dispatch ] = useReducer(controlReducer, values.initialControlState);
    const controlState = { controls, dispatch };

    return(
        <div>
            <ControlContext.Provider value={controlState}>
                <Controller />
                <Jumbotron >
                    <Creation />
                </Jumbotron>
                <SaveController />
            </ControlContext.Provider>        
        </div>
    );

}

export default Create;