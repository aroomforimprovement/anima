const apiUrl = process.env.REACT_APP_API_URL;

export const deleteAnim = async (animid, user) => {
    console.log("deleteAnim")
    const url = `${apiUrl}anim/${animid}`;
    const req = {
        method: 'DELETE',
        mode: 'cors'
    }
    if(user.access){
        req.headers = {
            Authorization: `Bearer ${user.access}`,
            'Content-Type': 'application/json'
        }
    }
    return fetch(url, req).then(response => {
        console.log("fetch")
        return response.ok ? true : false
    }, error => {
        return false
    }).catch(error => { console.error("Error fetching data: deleteAnim"); })
}

export const collectionItemReducer = (state, action) => {
    switch(action.type){
        case 'SET_PREVIEW_FILE':{
            const previewFile = URL.createObjectURL(action.data.blob);
            if(previewFile){
                return ({...state, 
                    previewFile: previewFile, 
                    previewName: action.data.name,
                });
            }
            return(state);
            
        }
        case 'SET_VIEW_FILE':{
            const viewFile = URL.createObjectURL(action.data.blob);
            return({...state,
                viewFile: viewFile,
                viewName: action.data.name
            });
        }
        case 'DELETE_ANIM':{
            return({...state, deleted: true, previewFile: undefined});
        }
        case 'PROGRESS_FRAME':{
            return({...state, progressFrame: action.data})
        }
        default:
            break;
    }
}