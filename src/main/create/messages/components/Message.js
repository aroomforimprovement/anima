import fetch from "node-fetch";
import { useEffect, useReducer, useState } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { Div } from "../../../../common/Div";
import { useAccount } from "../../../../shared/account";
import { Thumb } from "../../../collection/item/Thumb";
import { previewAnim } from "../../animation/anim-util";
import { preview } from "../../animation/preview";

const apiUrl = process.env.REACT_APP_API_URL;

const initialState = {thumbFile: null};

export const Message = ({message, updateAnim, index}) => {
    const {account} = useAccount();
    const [view, setView] = useState(false);
    const [viewFile, setViewFile] = useState(null);
    const [anim, setAnim] = useState(null);

    const reducer = (state, action) => {
        switch(action.type){
            case 'SET_THUMB_FILE':{
                console.debug('SET_THUMB_FILE');
                const thumbFile = action.data
                    ? URL.createObjectURL(action.data.blob)
                    : undefined;
                    if(thumbFile){
                        return({...state, 
                            thumbFile: thumbFile})
                    }
                return ({...state});
            }
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);
    
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
            <div className='message-sub'>{`${message.username}: `}</div><br/>
            <div className='message-header'>{`${message.anim}`}</div>
            <div className='message-sub'>{`, ${getDateTime(message.time)}`}</div>
            <div className='message-img float-end'>
                <img className="message-img rounded-3 p0"
                    key={index}
                    src={state.thumbFile}
                    alt={message.anim}/>
            </div>
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
            {
                state.thumbFile ? <Div/> 
                : <ReactP5Wrapper
                    sketch={preview}
                    anim={{bg: [], frames: [message.thumb]}}
                    updateAnim={updateAnim}
                    dispatch={dispatch}
                    type='THUMB' />
            }
        </div>
    )
}