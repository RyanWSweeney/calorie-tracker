import React from "react";
import UserInfo from "./userInfo";
import withAuth from "./withAuth";

export const Account = () => {

    return (
        <div>
            <h1>Account</h1>
            <UserInfo/>
        </div>
    );
}

export default withAuth(Account);