import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, Redirect, useHistory } from 'react-router-dom';
import Spinner from "./ui/Spinner";

export default function Signup() {
    const nameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const passwordConfirmRef = useRef('');
    const { currentUser, signup } = useAuth()
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');
    const history = useHistory();

    function handleSubmit(e) {
        e.preventDefault();

        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError("Passwords do not match")
        };
        

        const data = {
            name: nameRef.current.value,
            email: emailRef.current.value, 
            password: passwordRef.current.value
        };

     
        setError("");
        setLoading(true);

        fetch("api/users/signup", {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: " application/json",
                "Content-type": "application/json",
            },
            body: JSON.stringify(data) 
        })
        .then(res => {
            //check res.ok
            if(res.ok){
                return res.json();
            }
        //reject instead of throw
        return Promise.reject(res); 
        })
        .then(data => {
            console.log('Success:', data);
            signup({data});
           history.push("/");
        })
        .catch(err => {
            console.log(err.status, err.statusText);
            err.json().then((data) => {
            //get error message    
            console.log(data)
            setError(data.message)
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
          <div className={ loading ? "signup haveLoading": "signup" }>
              <div className="signbody">
                <h2>Sign up</h2>
                {error && <span>{error}</span>}
                <form onSubmit={handleSubmit}>

                    <div className="name">
                        <label htmlFor="name">Name: </label>
                        <input type="text" id="name" ref={nameRef} required/>
                    </div>   
                   
                    <div className="email">
                        <label htmlFor="email">Email: </label>
                        <input type="text" id="email" ref={emailRef} required/>
                    </div>
                  
                    <div className="password">
                        <label htmlFor="password">Password: </label>
                        <input type="password" id="password" ref={passwordRef}/>
                    </div>
                  
                    <div className="passwordConfirm">
                        <label htmlFor="passwordConfirm">Password Confirm: </label>
                        <input type="password" id="passwordConfirm" ref={passwordConfirmRef}/>
                    </div>
                  
                    <button disabled={loading} type="submit">Sign Up</button>
                </form>
              </div>
          </div>
          <div className="linkLogin">
          <span>Already have an account?</span>  
            <Link to="/login">Log In</Link>
        </div>  
        </div>
    )
}