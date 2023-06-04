import React from "react";
import UserInfo from "./userInfo";
import withAuth from "./withAuth";

export const Account = () => {

    const testOpenFoodFacts = () => {
        console.log('sending request');
        fetch('https://us.openfoodfacts.org/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=breakfast_cereals&json=true', {
            headers: {
                'User-Agent': 'Calorify - Web - Version 1.0 - https://github.com/RyanWSweeney/calorie-tracker'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.error(err);
            });
    }

    return (
        <div>
            <h1>Account</h1>
            <UserInfo/>
            <button onClick={testOpenFoodFacts}>Test Open Food Facts</button>
        </div>
    );
}

export default withAuth(Account);