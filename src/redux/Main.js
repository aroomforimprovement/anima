
export const mainReducer = (state, action) => {
    console.debug(`mainReducer: ${action.type}:${action.data}`);
    switch (action.type) {
        case 'CHECK_AUTH':{
            //should get really get display name from db (or update on auth0)
            let storedUser = {isAuth: false};
            if(action.data.isAuthenticated){
                const user = action.data.user;
                const userid = user.sub.replace('auth0|', '');
                storedUser = {userid: userid, email: user.email,
                    username: user.nickname, isAuth: true}
            }
            return({...state, user: storedUser});
        }
        case 'SET_ACCESS':{
            return({...state, access: action.data});
        }
        default:
            break;
    }
}
  