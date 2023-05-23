import React, { useEffect, useState, FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (ComponentToProtect: FunctionComponent) => {
    return (props: any) => {
        const [loading, setLoading] = useState(true);
        const [redirect, setRedirect] = useState(false);
        const navigate = useNavigate();

        useEffect(() => {
            fetch('/api/validateToken', {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
                .then(response => {
                    console.log(response)
                    if (response.statusText === 'success') {
                        console.log('Token validated');
                        setLoading(false);
                    } else {
                        throw new Error('Token validation failed');
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
            navigate('/login')
            return null;
        }
        return <ComponentToProtect {...props} />;
    };
};

export default withAuth;
