
export const mainReducer = (state, action) => {
    //console.debug(`mainReducer: ${action.type}:${action.data}`);
    //console.dir(action.data);
    switch (action.type) {
        case 'SET_USER':{
            return({...state, user: action.data, isSet: true});
        }
        case 'SET_USERNAME':{
            let user = {...state.user};
            user.username = action.data;
            return({...state, user: user});
        }
        case 'PROGRESS_FRAME':{
            return({...state, progressFrame: {max: 0, now: 0}});
        }
        case 'ANIM':{
            return({...state, anim: action.data})
        }
        default:
            return(state);
    }
}
  