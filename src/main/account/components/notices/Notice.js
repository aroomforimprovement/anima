import React from 'react';
import {SITE} from '../../../../shared/site';
import { addContact, deleteNotice } from '../../accountReducer';
import toast from 'buttoned-toaster';
import { useAccount } from '../../../../shared/account';


export const Notice = ({notice, i}) => {
    const {account, dispatch} = useAccount();

    const handleAcceptNotice = (i) => {
        //only handling contact req for the moment
        const approve = (id) => {
            addContact(account.notices[i], i, account.user.access)
            .then((response) => {
                deleteNotice(account.notices[i], i, account.user.access)
                    .then((response) => {
                        if(response && response.ok){
                            toast.success('Contact request approved');
                            dispatch({type: 'DELETE_NOTICE', data: i})
                        }else{
                            toast.error('Error approving contact request');
                        }
                    });
            }); 
            if(id){
                toast.dismiss(id);
            }   
        }
        const dismiss = (id) => {
            toast.dismiss(id);
        }

        if(window.localStorage.getItem(`dontshow_APPROVE_CONTACT_REQUEST_${account.user.userid}`)){
            approve();
        }else{
            toast.info(
                {
                    approveFunc: approve, 
                    dismissFunc: dismiss,
                    message: `By approving this contact request, you are allowing 
                        the user "${account.notices[i].reqUsername}" to view all of 
                        your anims, including those marked Private`,
                    approveTxt: "Approve", 
                    dismissTxt:"Maybe later",
                    canHide: true,
                    dontShowType: `APPROVE_CONTACT_REQUEST_${account.user.userid}`
                }
            );
        }
        
        
    }

    const handleRejectNotice = (i) => {
        deleteNotice(account.notices[i], i, account.user.access)
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
        let id;
        if(account.notices[i].targetUserid){
            id = account.notices[i].targetUserid;
        }else{
            id = account.notices[i].userid;
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