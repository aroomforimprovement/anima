import React, { useEffect } from 'react';
import {SITE} from '../../shared/site';
import { useMainContext } from '../../main/Main';
import { useAccountContext } from '../Account';
import { addContact, deleteNotice } from '../accountReducer';
import toast from 'react-hot-toast';
import { ToastConfirm, toastConfirmStyle } from '../../common/Toast';


export const Notice = ({notice, i, link}) => {

    const { mainState } = useMainContext();    
    const { state, dispatch } = useAccountContext();

    useEffect(() => {
        
    },[state.notices]);

    const handleAcceptNotice = (i) => {
        //only handling contact req for the moment
        const approve = (id) => {
            addContact(state.notices[i], i, mainState.user.access)
            .then((response) => {
                deleteNotice(state.notices[i], i, mainState.user.access)
                    .then((response) => {
                        if(response && response.ok){
                            toast.success('Contact request approved');
                            dispatch({type: 'DELETE_NOTICE', data: i})
                        }else{
                            toast.error('Error approving contact request');
                        }
                    });
            }); 
            toast.dismiss(id);   
        }
        const dismiss = (id) => {
            toast.dismiss(id);
        }

        toast((t) => (
            <ToastConfirm t={t} approve={approve} dismiss={dismiss}
                message={`By approving this contact request, you are allowing 
                    the user "${state.notices[i].reqUsername}" to view all of 
                    your anims, including those marked Private`}
                approveBtn={"Approve"} dismissBtn={"Maybe later"} />
        ), toastConfirmStyle());
        
    }

    const handleRejectNotice = (i) => {
        //console.log("handleRejectNotice");
        //console.dir(state.notices[i]);
        deleteNotice(state.notices[i], i, mainState.user.access)
            .then((response) => {
                if(response && response.ok){
                    dispatch({type: 'DELETE_NOTICE', data: i});
                    toast.success('Notification deleted');
                }else{
                    toast.error('Error deleting notification');
                }
            });
    }

    const handleVisitContactReq = (i) => {
        //console.log("handleVisitContact");
        let id;
        if(state.notices[i].targetUserid){
            id = state.notices[i].targetUserid;
        }else{
            id = state.notices[i].userid;
        }
        window.location.href = `/collection/${id}`;
    }

    return(
        <div className='col col-10 col-md-5 notice rounded ms-2 me-1 mt-2 mb-2'>
            <div className='row'>
                <div className='col col-12 col-sm-7 col-md-12 col-lg-5 mt-2 mb-3'>{notice.message}</div>
                <div className='col col-12 col-sm-5 col-md-12 col-lg-6 coll-item-btns end-zone float-middle'>
                    <button className='btn btn-outline-primary btn-sm mx-1'
                        onClick={() => handleVisitContactReq(i)}>
                        <img src={SITE.icons.preview} alt={`Visit requester`}/>
                    </button>
                    <button className='btn btn-outline-danger btn-sm mx-1'
                        onClick={() => handleRejectNotice(i)}>
                        <img src={SITE.icons.wipe} alt={`Reject`} />
                    </button>
                    {(notice.type && notice.type.indexOf('pending') > -1) 
                    ? <div></div> :
                    <button className='btn btn-outline-success btn-sm mx-1'
                        onClick={() => handleAcceptNotice(i)}>
                        <img src={SITE.icons.save} alt={`Accept`} />
                    </button>
                    }
                    
                </div>
            </div>
        </div>
    );
}