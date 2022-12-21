import { Message } from "./Message";
import { useState } from 'react';
import { Div } from "../../../../common/Div";
import { ReactP5Wrapper } from "react-p5-wrapper";

export const Conversation = ({conversation, updateAnim}) => {

    const [open, setOpen] = useState(true);
    const [thumbFiles, setThumbFiles] = useState([]);
    
    const messages = conversation?.messages?.map((message, i) => {
        console.dir(message);
        return(
            <Message key={i} 
                message={message} 
                updateAnim={updateAnim}
                thumbFile={thumbFiles?.[i]}
                index={i}
            />
        )
    })

    return(
        <div className='conversation'>
            {open ? <div>{messages}</div> : <Div/>}
            {conversation?.messages?.length > 0 
            ? <button type='button' className='btn btn-secondary btn-sm mb-1' 
                onClick={() => {
                    setOpen(!open);
                }}>{`${open ? 'Hide' : 'See'} conversation`}</button>
            : <Div />}
        </div>
    )
}