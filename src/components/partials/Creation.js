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
        console.log(action.type+':'+action.data);
        switch(action.type){
            case 'DO_STROKE':{
                let newUndos = state.undos;
                newUndos.push(action.data);
                return ({...state, undos: newUndos, 
                    redid: [], undid:[] });
            }
            case 'UNDO_STROKE':{
                console.log("reached UNDO STROKE");
                let newRedos = state.redos;
                let newUndos = state.undos;
                const undid = newUndos.pop();
                newRedos.push(undid);
                console.log("UNDID:");
                console.dir(undid);
                return ({ ...state, 
                    redos: newRedos, undos: newUndos, 
                    undid: undid, redid: []});
            }
            case 'REDO_STROKE':{
                let newRedos = state.redos;
                let newUndos = state.undos;
                const redid = newRedos.pop();
                newUndos.push(redid);
                return ({ ...state, 
                    redo: newRedos, undo: newUndos,
                    undid: [], redid: redid});
            }
            default:
                console.log("reached DEFAULT");
                return state;
        }
    }
    
    const [ anim, updateAnim ] = useReducer(animReducer, values.initialAnimState);
    const animState = { anim, updateAnim };
    
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
