import React from "react";
import { Toaster } from 'react-hot-toast';

export const Toast = () => {
    return (
        <Toaster />
    )
}

export const ToastConfirm = ({t, anim, approve, dismiss, message, approveBtn, dismissBtn}) => {

    return (
        <div className='container'>
            <div className='row'>
                <span>
                    {message}
                </span>
            </div>
            <div className='row mt-4 mx-auto end-zone'>
                <button className='btn-sm btn-outline-secondary col col-5 mx-2' onClick={() => dismiss(t.id)}>{dismissBtn}</button>
                <button className='btn-sm btn-outline-danger col col-5 mx-2' onClick={() => approve(t.id)}>{approveBtn}</button>
            </div>
        </div>
    );
}