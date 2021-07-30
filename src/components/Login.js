import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Spinner from './ui/Spinner';

export default function Login() {
    const emailRef = useRef('')
    const passwordRef = useRef('')
    const { currentUser, login } = useAuth()
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    function handleSubmit(e) {
        e.preventDefault();

        const data = {
            email: emailRef.current.value, 
            password: passwordRef.current.value
        };

        setError('');
        setLoading(true)
        
        fetch("/api/users/login", {
            method: "POST",
            credentials: 'include',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            })
            .then(res => {
                //check response.ok 
                if (res.ok) {
                return res.json();
            }
            //reject instead of throw
            return Promise.reject(res); 
            })
            .then(data => {
                console.log('Success:', data);
                // Do something the token in the login method
                login({data});
                history.push('/');
            })
            .catch(err => {
                console.log(err.status, err.statusText);
                err.json().then((data) => {
                //get error message    
                    console.log(data);
                setError(data.message);
                setLoading(false)
                })
            });         
        
    }

    if(currentUser){
        return <Redirect to="/" />;
    }

    return (
        <div className="container">
            {loading && <Spinner/>}
        <div className={loading ? "login haveLoading" : "login"}>
            <div className="loginBody">
                <h2>Log In</h2>
                {error && <span>{error}</span>}
                <form onSubmit={handleSubmit}>
                    <div className="email">
                        <label htmlFor="email">Email: </label>
                        <input type="text" id="email" ref={emailRef} required/>
                    </div>
                  
                    <div className="password">
                        <label htmlFor="password">Password: </label>
                        <input type="password" id="password" ref={passwordRef} required/>
                    </div>                  
                    <button disabled={loading} type="submit">log In</button>
                </form>
            </div>
        </div>
        <div className="linkSign">
          <span>Need an account?</span>  
            <Link to="/signup">Sign Up</Link>
        </div>
        </div>
    )
}
