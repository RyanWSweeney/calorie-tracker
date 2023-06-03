// AppBody.tsx
import React from 'react';
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login";
import ResetPassword from "./resetPassword";
import Register from "./register";
import Dashboard from "./dashboard";
import MenuAppBar from "./appbar";
import Account from "./account";
import { shouldShowAppBar } from "./RouteUtils";

interface AppBodyProps {
    onLogin: () => void;
}

const AppBody: React.FC<AppBodyProps> = ({ onLogin }) => {
    const location = useLocation();

    return (
        <>
            {shouldShowAppBar(location.pathname) ? <MenuAppBar /> : null}
            <Routes>
                <Route path={"/"} element={<Navigate to={"/login"} />} />
                <Route path={"/login"} element={<Login onLogin={onLogin} />} />
                <Route path={"/password"} element={<ResetPassword />} />
                <Route path={"/register"} element={<Register />} />
                <Route path={"/dashboard"} element={<Dashboard />} />
                <Route path={"/account"} element={<Account />} />
            </Routes>
        </>
    );
}

export default AppBody;