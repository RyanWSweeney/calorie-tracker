import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Login from "./components/login";
import Dashboard from "./components/dashboard";

function App() {
    const [loggedIn, setLoggedIn] = React.useState(false);

    const handleLogin = () => {
        setLoggedIn(true);
        console.log("here login success")
        console.log(loggedIn)
        //redirect to dashboard

    }

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Navigate to={"/login"}/>}/>
                <Route path={"/login"} element={<Login onLogin={handleLogin}/>}/>
                <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
        {/*<Login/>*/}
    </div>
  );
}

export default App;
