import React, { createContext, useReducer, useContext } from 'react';
import { Controller, SaveController } from './controller/Controller';
import { Jumbotron } from 'reactstrap';
import { Animation } from './animation/Animation';
import { values } from './values';
import { controlReducer } from './controller/controlReducer';
import { useParams } from 'react-router';

export const ControlContext = createContext(values.initialControlState);

export const useControlContext = () => {
    return useContext(ControlContext);
}

const Create = ({edit, loggingIn}) => {

    const [ controls, updateControls ] = useReducer(controlReducer, values.initialControlState);
    const controlState = { controls, updateControls };
    const splat = useParams()[0];
    return(
        <div>
            <ControlContext.Provider value={controlState}>
                <Controller />
                <Jumbotron >
                    <Animation 
                        edit={edit} 
                        splat={splat} 
                        loggingIn={loggingIn}
                    />
                </Jumbotron>
                <SaveController />
            </ControlContext.Provider>        
        </div>
    );

}

export default Create;