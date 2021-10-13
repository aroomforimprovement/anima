import React from 'react';
import { SITE } from '../../shared/site';
import { useAccountContext } from '../Account';
import { useMainContext } from '../Main';
import { deleteContact } from '../../redux/Account';


export const Contact = ({contact, i}) => {
    
    const { mainState } = useMainContext();
    const { state } = useAccountContext();

    const handleVisitContact = (i) => {
        console.log("handleVisitContact");
        const id = state.contacts[i].userid;
        window.location.href = `/collection/${id}`;
    }

    const handleDeleteContact = (i) => {
        console.log("handleDeleteContact");
        deleteContact(state.contacts[i], mainState.user.userid, 
            mainState.user.username, mainState.user.access)
            .then((response) => {
                console.log("should toast to this");
            });;
    }

    return(
        <div className='container contact'>
            <div>{contact.username}</div>
            <button className='btn btn-outline-success btn-sm'
                onClick={() => handleVisitContact(i)}>
                <img src={SITE.icons.preview} alt={`Visit ${contact.name}`}/>
            </button>
            <button className='btn btn-outline-danger btn-sm'
                onClick={() => handleDeleteContact(i)}>
                <img src={SITE.icons.wipe} alt={`Delete ${contact.name} from contacts`}/>
            </button>
        </div>
    );
}