import React, { useEffect, useState, FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (ComponentToProtect: FunctionComponent) => {
    return (props: any) => {
        const [loading, setLoading] = useState(true);
        const [redirect, setRedirect] = useState(false);
        const navigate = useNavigate();

        useEffect(() => {
            fetch('http://192.168.1.78:9229/api/validateToken', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        console.log('Token validated', data.message);
                        setLoading(false);
                    } else {
                        console.log('Token validation failed', data.message)
                        setLoading(false);
                        setRedirect(true);
                    }
                })
                .catch(error => {
                    console.error('Error during token validation', error);
                    setLoading(false);
                    setRedirect(true);
                });
        }, []);

        if (loading) {
            return null; // You could also return a loading spinner or similar here
        }
        if (redirect) {
            // navigate('/login')
            return null;
        }
        return <ComponentToProtect {...props} />;
    };
};

export default withAuth;
