import { Message } from "./Message";
import { useState } from 'react';
import { Div } from "../../../../common/Div";
import { ReactP5Wrapper } from "react-p5-wrapper";

export const Conversation = ({conversation, updateAnim}) => {

    const [open, setOpen] = useState(true);
    
    const messages = conversation?.messages?.map((message, i) => {
        console.dir(message);
        return(
            <Message key={i} 
                message={message} 
                updateAnim={updateAnim}
                index={i}
            />
        )
    })

    const HideButton = () => {
        return(
            <div>
                {conversation?.messages?.length > 0 
                ? <button type='button' className='btn btn-secondary btn-sm mb-1' 
                    onClick={() => {
                        setOpen(!open);
                    }}>{`${open ? 'Hide' : 'See'} conversation`}</button>
                : <Div />}
            </div>
        )
    }

    return(
        <div className='conversation'>
            <HideButton />
            {open ? <div>{messages}</div> : <Div/>}
            <HideButton />
        </div>
    )
}