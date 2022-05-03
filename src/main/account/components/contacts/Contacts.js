import React from "react";
import { Unverfied } from "../../../../common/Unverified";
import { useAccountContext } from "../../Account";
import { Contact } from "./Contact";

export const Contacts = ({verified}) => {
    const state = useAccountContext()[0];

    const contacts = state && state.contacts && state.contacts.length > 0
        ? state.contacts.map((contact, i) => {
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