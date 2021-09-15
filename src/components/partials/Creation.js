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
                return ({...state, 
                    "anim": {...state["anim"], 
                    bg: bg}});
            }
            case 'DRAW_BG':{
                return (state);
            }
            case 'WIPE':{
                return ({...state, redos: [], undos: [], redid:[], undid:[]});
            }
            case 'NEXT':{
                const frame = state.undos.length > 0 ? [...state.undos] : [];
                return ({...state, 
                    anim:{...state["anim"],
                    frames: [...state["anim"]["frames"], frame]}});
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
