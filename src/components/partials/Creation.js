import React, { createContext, useContext, useReducer } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { ControlContext, useControlContext } from '../Create';
import { values } from '../../animator/values';


const AnimContext = createContext(values.initialAnimState)

export const useAnimContext = () => {
    return useContext(AnimContext);
}

export const Creation = ({sketch}) => {
    
    const { controls, dispatch } = useControlContext();
    
    
    const animReducer = (state, action) => {
        //console.log(action.type+':'+action.data);
        switch(action.type){
            case 'DO_STROKE':{
                let newUndo = state.undo;
                newUndo.push(action.data);
                return ({...state, undo: newUndo, 
                    redid: [], undid:[] });
            }
            case 'UNDO_STROKE':{
                let newRedo = state.redo;
                let newUndo = state.undo;
                const undid = newUndo.pop();
                newRedo.push(undid);
                return ({ ...state, 
                    redo: newRedo, undo: newUndo, 
                    undid: undid, redid: []});
            }
            case 'REDO_STROKE':{
                let newRedo = state.redo;
                let newUndo = state.undo;
                const redid = newRedo.pop();
                newUndo.push(redid);
                return ({ ...state, 
                    redo: newRedo, undo: newUndo,
                    undid: [], redid: redid});
            }
            default:
                return state;
        }
    }
    
    const [ anim, updateAnim ] = useReducer(animReducer, values.initialAnimState);
    const animState = { anim, updateAnim };
    console.log("CONTROLS in CREATION:");
    console.dir(controls);
    return(
        <div>
            <ControlContext.Consumer> 
                {() => (
                <AnimContext.Provider value={animState}>
                    <ReactP5Wrapper sketch={sketch} 
                        controls={controls} dispatch={dispatch}
                        anim={anim} updateAnim={updateAnim}
                        //onMouseOver={() => dispatch({type: 'ENABLE'})} 
                        //onMouseOut={() => dispatch({type: 'DISABLE'})} />
                    />
                </AnimContext.Provider>
                )}
            </ControlContext.Consumer>
        </div>
    );
}
