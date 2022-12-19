import { Message } from "./Message";
import { useState } from 'react';
import { Div } from "../../../../common/Div";

export const Conversation = ({conversation, updateAnim}) => {

    const [open, setOpen] = useState(true);
    
    const messages = conversation?.messages?.map((message, i) => {
        console.dir(message);
        return(
            <Message key={i} message={message} updateAnim={updateAnim}/>
        )
    })

    return(
        <div className='conversation'>
            {open ? <div>{messages}</div> : <Div/>}
            <button type='button' className='btn btn-secondary btn-sm mb-1' 
                onClick={() => {
                    setOpen(!open);
                }}>{`${open ? 'Hide' : 'See'} conversation`}</button>
        </div>
    )
}