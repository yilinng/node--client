import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Link, Redirect, useHistory } from 'react-router-dom';

export default function Dashboard() {

    const [error, setError] = useState('');
    const { currentUser, logout, message, setMessage } = useAuth()
    const history = useHistory();

    //check private source and setHeader when match token
    
    async function handleLogout(){
        setError('')

        try {
            await logout()
            history.push("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    if (!currentUser) {
        return <Redirect to="/login" />;
      }

    return (
       <div className="container">
        <div className="card">
                <div className="cardBody">
                    <h2>Profile</h2>
                    {error && 
                    <div className="boardError">
                        <span>{error}</span>
                    </div>
                    }
                    {message ? 
                    <div className="boardMessage">
                        <span className="close" onClick={()=>setMessage('')}>X</span>
                        <span className="msg">{message}</span> 
                    </div> :
                    <div className="nullMessage"></div>
                    }
                    <div className="textwelcome">
                        <span className="welcome">Welcome </span>
                        <span className="name">{currentUser.user.name}</span>
                    </div>
                    <div className="link">
                        <Link to="/update-profile">
                            Update Profile
                        </Link>
                        <Link to="/todos">
                        Todo List
                        </Link>
                    </div>
                   
                   
                </div>
        </div>
        <div className="logout">
            <button onClick={handleLogout}>
                Log Out
            </button>
        </div>
       </div>
    )
}