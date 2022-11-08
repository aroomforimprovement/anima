import React from "react";
import { Unverfied } from "../../../../common/Unverified";
import { useAccount } from "../../../../shared/account";
import { Contact } from "./Contact";

export const Contacts = ({verified}) => {
    const { account } = useAccount();

    const contacts = account && account.contacts 
        && typeof account.notices === 'object' 
        && account.contacts.length > 0
        ? account.contacts.map((contact, i) => {
            return(<Contact contact={contact} i={i} key={i} />);
        }) : <div>Nobody here</div>

    return(
        <div>
            {verified
            ? <div className='row section-content'>{contacts}</div>
            : <Unverfied className='row mb-4' />}
        </div>
    )
}