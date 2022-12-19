import fetch from "node-fetch";
import { useEffect, useState } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { Div } from "../../../../common/Div";
import { useAccount } from "../../../../shared/account";
import { previewAnim } from "../../animation/anim-util";
import { preview } from "../../animation/preview";

const apiUrl = process.env.REACT_APP_API_URL;

export const Message = ({message, updateAnim}) => {
    const {account} = useAccount();
    const [view, setView] = useState(false);
    const [viewFile, setViewFile] = useState(null);
    const [anim, setAnim] = useState(null);

    const getDateTime = (time) => {
        //TODO translate timestamp
        if(time){
            return time;
        }else{
            return "Unknown";
        }
    }

    const renderMessage = () => {
        fetch(`${apiUrl}messages/message/${message.messid}`,
            {headers: {
                Authorization: `Bearer ${account.user.access}`,
            }
        }).then(response => {
            if(response.ok){
                return response.json();
            }
        }).then(response => {
            console.log(response);
            setAnim(response.anim);
            updateAnim({type: 'PREVIEW', data: true});
            setView(true);
        })
    }

    return(
        <div className='message'
            onClick={() => renderMessage()}>
            <div className='message-sub'>{`${message.username}: `}</div>
            <div className='message-header'>{`${message.anim}`}</div>
            <div className='message-sub'>{`, ${getDateTime(message.time)}`}</div>
            {
                viewFile || !view
                ? <Div />
                : anim 
                ? <ReactP5Wrapper 
                    sketch={preview} 
                    anim={anim}
                    updateAnim={updateAnim}
                    type='VIEW'/>
                : <Div/>
            }
        </div>
    )
}