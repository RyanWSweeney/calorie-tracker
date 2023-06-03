import React from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import AppBody from "./components/appBody";

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
                <AppBody onLogin={handleLogin} />
            </BrowserRouter>
        </div>
    );
}

export default App;
