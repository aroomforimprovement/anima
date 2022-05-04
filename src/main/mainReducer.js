
export const mainReducer = (state, action) => {
    //console.debug(`mainReducer: ${action.type}:${action.data}`);
    //console.dir(action.data);
    switch (action.type) {
        case 'CHECK_AUTH':{
            //should get really get display name from db (or update on auth0)
            let storedUser = {isAuth: false};
            if(action.data.isAuthenticated){
                const user = action.data.user;
                const userid = user.sub.replace('auth0|', '');
                const verified = user.email_verified;
                storedUser = {userid: userid, email: user.email,
                    username: user.nickname, isAuth: true, isVerified: verified, 
                    access: (state.user && state.user.access) ? state.user.access : null}
            }
            return({...state, user: storedUser});
        }
        case 'SET_ACCESS':{
            let user = {};
            if(state.user){
                user = {...state.user};
            }
            user.access = action.data
            return({...state, user: user});
        }
        case 'SET_USERNAME':{
            let user = {...state.user};
            user.username = action.data;
            return({...state, user: user});
        }
        case 'SET_ACCOUNT_INFO':{
            return({...state, contacts: action.data.contacts, notices: action.data.notices, 
                user: {...state.user, username: action.data.username ? action.data.username : state.user.username},isSet: action.data.isSet});
        }
        case 'PROGRESS_FRAME':{
            return({...state, progressFrame: {max: 0, now: 0}});
        }
        case 'LOGGING_IN':{
            return({...state, loggingIn: action.data});
        }
        case 'LOGGED_IN':{
            return({...state, loggedIn: action.data, logginIn: action.data ? false : true});
        }
        case 'ANIM':{
            return({...state, anim: action.data})
        }
        default:
            return(state);
    }
}
  