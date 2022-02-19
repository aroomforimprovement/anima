import { toast } from 'react-hot-toast';

const apiUrl = process.env.REACT_APP_API_URL;

export const deleteAnim = async (animid, user) => {
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
        if(response.ok){
            
            toast.success("Anim deleted as requested");
            //temporary solution for rendering issue (ANIM-201)
            //window.location.href = window.location.href;
        }else{
            //console.log("response not ok");
            toast.error("Error deleting the anim");
        }
    }, error => {
        console.error(error);
    }).catch(error => { console.error(error);})
}

export const collectionItemReducer = (state, action) => {
    switch(action.type){
        case 'SET_PREVIEW_FILE':{
            const previewFile = URL.createObjectURL(action.data.blob);
            return ({...state, 
                previewFile: previewFile, 
                previewName: action.data.name,
            });
        }
        case 'SET_VIEW_FILE':{
            const viewFile = URL.createObjectURL(action.data.blob);
            return({...state,
                viewFile: viewFile,
                viewName: action.data.name
            });
        }
        case 'DELETE_ANIM':{
            deleteAnim(action.data.animid, action.data.user);
            return({...state, deleted: true});
        }
        default:
            break;
    }
}