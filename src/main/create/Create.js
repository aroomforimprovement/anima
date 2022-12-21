import React, { createContext, useReducer, useContext } from 'react';
import { Jumbotron } from 'reactstrap';
import { Animation } from './animation/Animation';
import { values } from './values';
import { controlReducer } from './controller/controlReducer';
import { useParams } from 'react-router';
import './create.scss';

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
                <Jumbotron >
                    <Animation 
                        edit={edit} 
                        splat={splat} 
                        loggingIn={loggingIn}
                    />
                </Jumbotron>
            </ControlContext.Provider>        
        </div>
    );

}

export default Create;