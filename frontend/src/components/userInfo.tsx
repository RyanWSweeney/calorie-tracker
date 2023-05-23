import React from "react";
import { useNavigate } from "react-router-dom";
import withAuth  from "./withAuth";

export const userInfo = () => {
    return (
        <div>
            <h1>UserInfo</h1>
        </div>
    );

}

export default withAuth(userInfo);