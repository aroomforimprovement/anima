import React, { useState, useEffect } from 'react';
import toast from 'buttoned-toaster';
import { Div } from '../../../../common/Div';
import { useAccount } from '../../../../shared/account';

export const ClearChoices = () => {
    
    const {account} = useAccount();

    const resetChoices = () => {
        Object.keys(window.localStorage).forEach((key) => {
            if(key.indexOf('dontshow_') > -1 && key.indexOf(account?.user?.userid) > -1)
            window.localStorage.removeItem(key);
        })
        toast.success("Choices cleared from browser memory");
        setHadSomethingToHide(false);
    }

    const [hasSomethingToHide, setHadSomethingToHide] = useState(false);

    useEffect(() => {
        Object.keys(window.localStorage).forEach((key) => {
            if(key.indexOf('dontshow_') > -1
                && key.indexOf(account?.user?.userid) > -1
                && !hasSomethingToHide)
            setHadSomethingToHide(true);
        })
    }, [hasSomethingToHide, account?.user?.userid])

    return(
        <div className='row mb-4 ms-2 section-content'>
            <div className='row'>
                <div className='col col-8'>
                    <h5>Reset choices:</h5>
                    {hasSomethingToHide 
                    ? `Push this button to clear all "don't show this again" choices you've made`
                    : `You have no user experience choices saved to this browser`}
                </div>
                    {hasSomethingToHide 
                    ? <div className='col col-3 float-end'>
                        <button className='btn btn-warning fa fa-lg fa-check-circle border border-danger shadow p-4'
                            onClick={resetChoices}></button>
                    </div> : <Div/>}
                </div>
        </div>
    )
}