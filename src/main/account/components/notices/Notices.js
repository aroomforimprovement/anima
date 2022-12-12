import React from "react";
import { Unverfied } from "../../../../common/Unverified";
import { useAccount } from "../../../../shared/account";
import { Notice } from "./Notice";

export const Notices = ({verified}) => {
    
    const {account} = useAccount();
    console.dir(account)
    const notices = account && account.notices 
        && typeof account.notices === 'object' 
        && account.notices.length > 0 
        ? account.notices.map((notice, i) => {
            
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