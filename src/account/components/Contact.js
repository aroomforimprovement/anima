import React from 'react';
import { SITE } from '../../shared/site';
import { useAccountContext } from '../Account';
import { useMainContext } from '../../main/Main';
import { deleteContact } from '../accountReducer';
import { useToastRack } from 'buttoned-toaster';


export const Contact = ({contact, i}) => {
    
    const { mainState } = useMainContext();
    const { state, dispatch } = useAccountContext();
    const toast = useToastRack();
    
    const handleVisitContact = (i) => {
        //console.log("handleVisitContact");
        const id = state.contacts[i].userid;
        window.location.href = `/collection/${id}`;
    }

    const handleDeleteContact = (i) => {
        //console.log("handleDeleteContact");
        deleteContact(state.contacts[i], mainState.user.userid, 
            mainState.user.username, mainState.user.access)
                .then((response) => {
                    if(response && response.ok){
                        dispatch({type: 'DELETE_CONTACT', data: i});
                        toast.success("Contact deleted");
                    }else{
                        toast.error(SITE.failed_delete_message);
                    }
                    //console.log("should toast to this");
                });
    }

    return(
        <div className='col col-10 col-md-5 col-lg-5 contact rounded m-2 py-3'>
            <div className='row m-1'>
                <div className='col col-6 col-sm-8 col-md-6 contact-name'>{contact.username}</div>
                <div className='col col-6 col-sm-4 col-md-6 coll-item-btns end-zone'>
                    <button className='btn btn-outline-primary btn-sm mx-1'
                        onClick={() => handleVisitContact(i)}>
                        <img src={SITE.icons.preview} alt={`Visit ${contact.name}`}/>
                    </button>
                    <button className='btn btn-outline-danger btn-sm mx-1'
                        onClick={() => handleDeleteContact(i)}>
                        <img src={SITE.icons.wipe} alt={`Delete ${contact.name} from contacts`}/>
                    </button>
                </div>
            </div>
        </div>
    );
}