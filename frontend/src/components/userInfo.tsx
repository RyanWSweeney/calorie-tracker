import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import withAuth  from "./withAuth";

interface UserInfo {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    country: string;
}
const UserInfo: React.FunctionComponent = () => {
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        fetch('http://192.168.1.78:9229/api/userInfo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => setUser(data.user))
            .catch(error => console.error('Error fetching user info', error));
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{user.username}</h1>
            <p>{user.email}</p>
            <p>{user.firstName}</p>
            <p>{user.lastName}</p>
            <p>{user.address}</p>
            <p>{user.city}</p>
            <p>{user.state}</p>
            <p>{user.zip}</p>
            <p>{user.phone}</p>
            <p>{user.country}</p>
        </div>
    );
}

export default withAuth(UserInfo);