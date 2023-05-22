import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Login from "./components/login";
import ResetPassword from "./components/resetPassword";
import Register from "./components/register";
import Dashboard from "./components/dashboard";

function App() {

    const [loggedIn, setLoggedIn] = React.useState(false);

    const handleLogin = () => {
        if(sessionStorage.getItem("token")){
            console.log(sessionStorage.getItem("token"))
            setLoggedIn(true);
        }
    }

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Navigate to={"/login"}/>}/>
                <Route path={"/login"} element={<Login onLogin={handleLogin}/>}/>
                <Route path={"/password"} element={<ResetPassword/>}/>
                <Route path={"/register"} element={<Register/>}/>
                <Route path="/dashboard" element={sessionStorage.getItem("token") != null ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
        {/*<Login/>*/}
    </div>
  );
}

export default App;
