import React from "react";
import { DisplayName } from "./DisplayName";
import { ClearChoices } from "./ClearChoices";

export const Settings = ({account}) => {

    return(
        <div>
            <DisplayName account={account}/>
            <ClearChoices />
        </div>
    )
}