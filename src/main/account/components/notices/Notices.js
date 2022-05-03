import React from "react";
import { Unverfied } from "../../../../common/Unverified";
import { useAccountContext } from "../../Account";
import { Notice } from "./Notice";

export const Notices = ({verified}) => {
    
    const state = useAccountContext()[0];

    const notices = state && state.notices && state.notices.length > 0 
        ? state.notices.map((notice, i) => {
            
            const link = `/collection/${notice.actions.accept}`;
            return(
                <Notice notice={notice} link={link} i={i} key={i}/>
            );
        })
        : <div>Nothing to report</div>

    return(
        <div className='section-content'>
            {verified
            ? <div className='row'>{notices}</div>
            : <Unverfied className='row mb-4' />}
        </div>
    )
}