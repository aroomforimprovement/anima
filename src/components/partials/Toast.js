import React from "react";
import { Toaster } from 'react-hot-toast';

export const Toast = () => {
    return (
        <Toaster />
    )
}

export const toastConfirmStyle = () => {
    return {duration: 60000, 
        style: {
            padding: 40, 
            border: '2px solid #550000', 
            backgroundColor: '#555',
            color: '#eee'
        }
    };    
}

export const ToastConfirm = ({t, approve, dismiss, message, approveBtn, dismissBtn}) => {

    return (
        <div className='container'>
            <div className='row'>
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