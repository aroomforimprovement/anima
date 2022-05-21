import React from "react";
import { DisplayName } from "./DisplayName";
import { ClearChoices } from "./ClearChoices";
import { ResendVerfication } from "./ResendVerification";

export const Settings = ({account}) => {

    return(
        <div>
            <DisplayName account={account}/>
            <ClearChoices />
            <ResendVerfication user={account.user}/>
        </div>
    )
}