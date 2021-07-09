import React, {useRef, useState} from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, Redirect } from 'react-router-dom';

export default function UpdateProfile() {

    const nameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const passwordConfirmRef = useRef('');
    const { currentUser, updateUser } = useAuth()
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');

    function handleSubmit(e){
        e.preventDefault();

        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError("Passwords do not match");
        };
        const name = nameRef.current.value ? nameRef.current.value : currentUser.user.name;
        const email = emailRef.current.value ? emailRef.current.value : currentUser.user.email;
        const password = passwordRef.current.value ? passwordRef.current.value : currentUser.user.password;

        const data = {
            _id: currentUser.user._id,
            name: name,
            email: email, 
            password: password
        };

        setError("");
        setLoading(true);
        //have to use certain cookies have to pass to authContext's updateUser
        updateUser(data);

        setLoading(false);
       
    } 

    
    if (!currentUser) {
        return <Redirect to="/login" />;
      }

    return (
        <div className="container">
          <div className="update">
              <div className="updatebody">
                <h2>Update Profile</h2>
                {error && <span>{error}</span>}
                <form onSubmit={handleSubmit}>

                    <div className="name">
                        <label htmlFor="name">Name: </label>
                        <input type="text" 
                        id="name" ref={nameRef} 
                        required 
                        defaultValue={currentUser.user.name}
                        />
                    </div>   
                   
                    <div className="email">
                        <label htmlFor="email">Email: </label>
                        <input type="text"
                        id="email" ref={emailRef}
                        defaultValue={currentUser.user.email}/>
                    </div>
                  
                    <div className="password">
                        <label htmlFor="password">Password: </label>
                        <input type="password"
                        id="password" ref={passwordRef} 
                        placeholder="leave blank to keep the same"/>
                    </div>
                  
                    <div className="passwordConfirm">
                        <label htmlFor="passwordConfirm">Password Confirm: </label>
                        <input type="password" 
                        id="passwordConfirm" ref={passwordConfirmRef} 
                        placeholder="leave blank to keep the same"/>
                        
                    </div>
                  
                    <button disabled={loading} type="submit">Update</button>
                </form>
              </div>
          </div>
          <div className="linkhome">
          <span>Already have an account?</span>  
            <Link to="/">Cancel</Link>
        </div>  
        </div>
    )
}
