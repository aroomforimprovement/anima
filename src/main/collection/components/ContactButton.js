import { useAccount } from "../../../shared/account";
import { useCollectionContext } from "../Collection";
import toast from 'buttoned-toaster';
import { addContactRequest } from "../collectionReducer";

export const ContactButton = () => {

    const {collectionState, setCollectionState} = useCollectionContext();
    const {account} = useAccount();

    const isContact = (id) => {
        if(account && account.contacts){
                for(let i = 0; i < account.contacts.length; i++){
                    if(account.contacts[0].userid === id){
                        return true;
                    }
                }
                return false;
        }
        return false;
    }

    const isContactRequested = (id) => {
        if(account && account.notices && account.notices.length > 0){
            for(let i = 0; i < account.notices.length; i++){
                if(account.notices[i].type && account.notices[i].type.indexOf('pending-contact') > -1){
                    if(account.notices[i].targetUserid === id){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
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
        <div>
        {
            !account.user || !account.user.isAuth || !account.user.isVerified ||
            collectionState.isOwn || isContact(collectionState.userid) || isContactRequested(collectionState.userid)
            ? 
            <div></div> 
            : 
            <button className='col btn btn-outline-light btn-sm fa fa-users'
            onClick={handleAddContact} hidden={!collectionState.contactReqEnabled}>{'Add as contact'}
            </button>
        }
        </div>
        
    );
}