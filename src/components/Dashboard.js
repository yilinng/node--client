import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Link, Redirect, useHistory } from 'react-router-dom';

export default function Dashboard() {

    const [error, setError] = useState('');
    const { currentUser, logout, message } = useAuth()
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
                    {error && <span>{error}</span>}
                    {message && <span>{message}</span>}
                    <strong>Email:</strong> {currentUser.user.email}
                    <Link to="/update-profile">
                        Update Profile
                    </Link>
                    <Link to="/todos">
                    Todo List
                    </Link>
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
