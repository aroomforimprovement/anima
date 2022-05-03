import React from 'react';
import toast from 'buttoned-toaster';
import { deleteAccount } from '../../accountReducer';
import { useAuth0 } from '@auth0/auth0-react';

export const DeleteAccount = ({user}) => {

    const { logout } = useAuth0();

    const handleDeleteAccount = () => {
        const approve = (id) => {
            deleteAccount(user.userid, user.access)
                .then((response) => {
                    if(response && response.ok){
                        toast.success("Account deleted");
                        logout(`${process.env.REACT_APP_URL}/logout`);
                    }else{
                        toast.error("Error deleting account");
                    }
                })
            toast.dismiss(id);
        }
        const dismiss = (id) => {
            toast.dismiss(id);
        }

        toast.warn(
            { 
                approveFunc: approve, 
                dismissFunc: dismiss,
                message:
                    <div>
                        <p>
                            You are about to delete your Anima account, all your anims and
                            all your contacts. Are you sure you want to delete everything?
                        </p>
                        <p>
                            (If you log in with the same username and password again, Anima will
                            create a new account)
                        </p>
                    </div>,
                approveTxt: "Delete everything", 
                dismissTxt: "Maybe later"
            }
        );
    }

    return(
        <div className='row col-10 col-lg-7 m-auto section-content mb-3'>
            <button className='btn btn-lg btn-danger shadow shadow-lg'
                onClick={handleDeleteAccount}>
                Delete my account and all of my anims forever.
            </button>
        </div>
    )
}