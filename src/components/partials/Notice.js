import React from '../Account';
import {SITE} from '../../shared/site';
import { useMainContext } from '../Main';
import { useAccountContext } from '../Account';
import { addContact, deleteNotice } from '../../redux/Account';


export const Notice = ({notice, i, link}) => {

    const { mainState } = useMainContext();    
    const { state, dispatch } = useAccountContext();


    const handleAcceptNotice = (i) => {
        console.log("handleAcceptNotice");
        console.dir(state.notices[i]);
        //only handling contact req for the moment
        addContact(state.notices[i], i, mainState.user.access)
        .then((response) => {
            deleteNotice(state.notices[i], i, mainState.user.access);
        });
    }

    const handleRejectNotice = (i) => {
        console.log("handleRejectNotice");
        console.dir(state.notices[i]);
        deleteNotice(state.notices[i], i, mainState.user.access)
            .then((response) => {
                if(response.modifiedCount > 0){
                    dispatch({type: 'DELETE_NOTICE', data: i});
                }
            });
    }

    return(
        <div className='container notice' key={i}>
                    <div>{notice.message}</div>
                    <a href={link} target='_blank' rel='noreferrer' alt='Visit the requester profile'>
                        Check out their profile
                    </a>
                    <button className='btn btn-outline-secondary btn-sm'
                        onClick={() => handleRejectNotice(i)}>
                        <img src={SITE.icons.wipe} alt={`Reject`} />
                    </button>
                    <button className='btn btn-outline-primary btn-sm'
                        onClick={() => handleAcceptNotice(i)}>
                        <img src={SITE.icons.save} alt={`Accept`} />
                    </button>
                </div>
    );
}