import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { Loading } from "../../common/Loading";
import { useAccount } from "../../shared/account"
import { messagesReducer } from "./messagesReducer";

const MessagesContext = createContext();

export const useMessagesContext = () => {
    return useContext(MessagesContext);
}

const INIT_MESSAGES_STATE = {

}

const Messages = () => {

    const { account } = useAccount();
    const [isVerified, setIsVerified] = useState(false);

    const [messagesState, setMessagesState] = useReducer(messagesReducer, INIT_MESSAGES_STATE);
    const stateOfMessages = { messagesState, setMessagesState };
    const [isFailed, setIsFailed] = useState(false);

    useEffect(() => {
        if(account.user && account.user.isVerified){
            setIsVerified(account.user.isVerified);
        }
    }, [account.user]);


    const conversations = messagesState ? messagesState?.conversations?.map((conv) => {
        return(
            <div>
                <div>{conv.header}</div>
                <div>{conv.text}</div>
            </div>
        )
    }) : <Loading/>

    return (
        <div>
            {conversations}
        </div>
    )
}

export default Messages;