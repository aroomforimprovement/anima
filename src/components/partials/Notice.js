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
        <div className='col col-10 col-md-5 notice rounded ms-2 me-1 mt-2 mb-2'>
            <div className='row'>
                <div className='col col-12 col-sm-7 col-md-12 col-lg-7 mt-2 mb-3'>{notice.message}</div>
                <div className='col col-12 col-sm-5 col-md-12 col-lg-5 coll-item-btns mt-3 mb-3'>
                    <a className='btn btn-outline-primary btn-sm mx-1' href={link} target='_blank' rel='noreferrer' alt='Visit the requester profile'>
                        <img src={SITE.icons.preview} alt='Check out their profile' />
                    </a>
                    <button className='btn btn-outline-danger btn-sm mx-1'
                        onClick={() => handleRejectNotice(i)}>
                        <img src={SITE.icons.wipe} alt={`Reject`} />
                    </button>
                    <button className='btn btn-outline-success btn-sm mx-1'
                        onClick={() => handleAcceptNotice(i)}>
                        <img src={SITE.icons.save} alt={`Accept`} />
                    </button>
                </div>
            </div>
        </div>
    );
}