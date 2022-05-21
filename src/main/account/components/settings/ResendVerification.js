import React from 'react';
import toast from 'buttoned-toaster';

export const ResendVerfication = ({user}) => {
    const endpoint = `${process.env.REACT_APP_API_URL}verify`
    
    const resendVerification = () => {
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access}`
            },
            body: JSON.stringify({user_id: `auth0|${user.userid}`})
        }).then(response => response.text())
        .then(data => {
            if(data.indexOf('job') > -1){
                toast.info("Verification email resent successfully");
            }
        })
        .catch(error => console.error(error))
    }

    const Verified = () => {
        return <div>{`You're account has been verified`}</div>
    }

    const Unverified = () => {
        return (
            <div className='row'>
                <div className='col col-8'>
                {`You need to verify your account to use some features.
                Check the email account you signed up with for the verification email
                or click here to resend the verification mail.`}
                </div>
                <div className='col col-3'>
                <button 
                    className='btn btn-warning border border-success fa fa-check-circle shadow p-4'
                    onClick={resendVerification}></button>
                </div>
            </div>
        )
    }
    
    return(
        <div className='row mb-4 ms-2 section-content'>
            <div >
                {user && user.isAuth 
                ? <h5>Account verification:</h5> : <div></div>}
                {user ? user.isVerified ? 
                <Verified /> : <Unverified/> : <div></div>} 
            </div>       
        </div>
    )
}