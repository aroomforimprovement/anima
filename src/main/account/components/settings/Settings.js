import React from "react";
import { DisplayName } from "./DisplayName";
import { ClearChoices } from "./ClearChoices";
import { ResendVerification } from "./ResendVerification";

export const Settings = ({account}) => {

    return(
        <div>
            <DisplayName account={account}/>
            <ClearChoices />
            <ResendVerification user={account.user}/>
        </div>
    )
}