import React from "react";
import { toast } from 'react-hot-toast';

export const toastConfirmStyle = (id) => {
    return {duration: 60000, id: id,
        style: {
            padding: 10, 
            border: '2px solid #550000', 
            backgroundColor: '#555',
            color: '#eee'
        }
    };    
}

export const toastForeverStyle = (id) => {
    return {
        duration: 3000, 
        id: id,
        position: 'bottom-center',
        style: {
            color: '#fff',
            backgroundColor: '#aaa',
            textAlign: 'start',
            minWidth: '100vw',
            padding: '5px'
        }
    }
}

export const ToastForever = ({t, message}) => {
    return(
        <div>{message}</div>
    );
}

export const ToastConfirm = ({t, approve, dismiss, message, approveBtn, dismissBtn}) => {

    return (
        <div className='container end-zone'>
            <button className='btn btn-sm btn-close ' onClick={() => toast.dismiss(t.id)}></button>
            <div className='row float-center'>
                <h6>Confirm</h6>
            </div>
            <div className='row'>
                <span>
                    {message}
                </span>
            </div>
            <div className='row mt-4 mx-auto end-zone'>
                <button className='btn btn-sm btn-outline-secondary col col-5 mx-2' 
                    style={{backgroundColor: '#333', color: '#ddd'}} 
                    onClick={() => dismiss(t.id)}>
                        {dismissBtn}
                </button>
                <button className='btn btn-sm btn-outline-danger col col-5 mx-2'
                    style={{backgroundColor: '#ddd', color: '#333'}} 
                    onClick={() => approve(t.id)}>
                        {approveBtn}
                </button>
            </div>
        </div>
    );
}


export const handleFailedConnection = (message, takeHome) => {
    const dismiss = (id) => {
        toast.dismiss(id);
        takeHome ? window.location.href = '/' : console.error(message);
        
    }
    toast((t) => (
        <ToastConfirm t={t} approve={dismiss} dismiss={dismiss}
            message={message}
            approveBtn={"Cool"} dismissBtn={"OK"} /> 
    ), toastConfirmStyle('connection'));
}


export const handleProgress = (promise, loading, success, error) => {
    toast.promise(promise, {
        loading: loading,
        success: success,
        error: error
    });
}

