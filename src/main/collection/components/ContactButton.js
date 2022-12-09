import { useAccount } from "../../../shared/account";
import { useCollectionContext } from "../Collection";
import toast from 'buttoned-toaster';
import { addContactRequest } from "../collectionReducer";

export const ContactButton = () => {

    const {collectionState, setCollectionState} = useCollectionContext();
    const {account} = useAccount();
    
    const handleAddContact = (e) => {
        const approve = (id) => {
            addContactRequest(collectionState.userid, collectionState.username, 
                account.user.username, account.user.userid, account.user.access)
                .then((response) => {
                    //should check and set this on page load as well - would have to retrieve contacts and notices from target collection on fetch
                    setCollectionState({type: 'SET_CONTACT_REQ_ENABLED', data: false});
                    if(response){
                        toast.success("Contact request sent");
                    }else{
                        toast.error("Error sending contact request");
                    }
                });
            toast.dismiss(id);
        }

        const dismiss = (id) => {
            toast.dismiss(id);
        }     

        toast.info( 
            {
                approveFunc: approve, 
                dismissFunc: dismiss,
                message: `You are about to send a contact request to ${collectionState.username}. 
                    After they approve the request, you will be able view all of eachother's anims,
                     even the ones marked Private`,
                approveTxt: "Send Contact Request", 
                dismissTxt: "Maybe later"
            }
        );
    }

    return(
        <button className='col btn btn-outline-light btn-sm fa fa-users'
            onClick={handleAddContact} hidden={!collectionState.contactReqEnabled}>{'Add as contact'}
        </button>
    );
}