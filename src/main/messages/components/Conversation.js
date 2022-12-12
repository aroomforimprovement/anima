import { Message } from "./Message"

export const Conversation = ({conversation}) => {

    const messages = conversation?.messages?.map((message) => {
        return(
            <Message message={message}/>
        )
    })

    return(
        <div>
            {messages}
        </div>
    )
}