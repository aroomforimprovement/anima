import React from 'react';
import { SITE } from '../../../../shared/site';
import { useAccountContext } from '../../Account';
import { useMainContext } from '../../../Main';
import { deleteContact } from '../../accountReducer';
import toast from 'buttoned-toaster';


export const Contact = ({contact, i}) => {
    
    const { mainState } = useMainContext();
    const { state, dispatch } = useAccountContext();
    
    const handleVisitContact = (i) => {
        const id = state.contacts[i].userid;
        window.location.href = `/collection/${id}`;
    }

    const handleDeleteContact = (i) => {
        const approve = (id) => {
            deleteContact(state.contacts[i], mainState.user.userid, 
                mainState.user.username, mainState.user.access)
            .then((response) => {
                if(response && response.ok){
                    dispatch({type: 'DELETE_CONTACT', data: i});
                    toast.success("Contact deleted");
                }else{
                    toast.error(SITE.failed_delete_message);
                }
            });
            if (id) toast.dismiss(id);
        }

        const dismiss = (id) => {
            toast.dismiss(id);
        }
        if(window.localStorage.getItem('dontshow_DELETE_CONTACT')){
            approve();
        }else{
            toast.warn(
                {
                    approveFunc: approve,
                    dismissFunc: dismiss,
                }
            );
        }
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