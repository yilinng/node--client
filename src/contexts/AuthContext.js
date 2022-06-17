import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [todos, setTodos] = useState('');
    const history = useHistory();

    function signup(data) {
        // { sourceProperty: targetVariable }
        const { accessToken, newToken, newUser: user } = data.data;

        setCurrentUser(prevState => {
            return {...prevState, user};
        });

        Cookies.set('auth', accessToken)
        Cookies.set('reauth', newToken.refresh_token) 

        getTodo();
    }

    function login(data) {

        const { accessToken, newToken, user } = data.data;
        //jwt timetstamp is ufc-base so have to according to timestamp to plus or cut
        
        setCurrentUser(prevState => {
            return {...prevState, user};
        });
        
        //const event = new Date(inMemoryToken.expiry);

        //console.log(event, inMemoryToken.expiry);
        Cookies.set('auth', accessToken)
        Cookies.set('reauth', newToken.refresh_token) 
       
        getTodo();
    }

   

    function logout(){

        const cookies = Cookies.get('reauth') ? Cookies.get('reauth'): null;

        fetch(process.env.REACT_APP_NOT_SECRET_CODE +'/api/users/logout', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: cookies })
        })
        .then(res => {
            //check res.ok
            if(res.ok){
                return res.text()
            }
            //reject instead of throw
            return Promise.reject(res);
        })
        .then(data =>{
            setCurrentUser('');
            Cookies.remove('auth');
            Cookies.remove('reauth') 
        })
        .catch(error => console.error('Error:', error));
        
    }

    const getToken = useCallback(() => {
        
       const cookies = Cookies.get('reauth') ? Cookies.get('reauth'): null;
        
        if(cookies !== null){
          
            fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/users/token', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({ token: cookies }),
                })
                .then(res => {
                    //check res.ok
                    if(res.ok){
                        return res.json()
                    }
                    //reject instead of throw
                    return Promise.reject(res);
                })
                .then(data => Cookies.set('auth', data.accessToken))      
                .catch(error => console.error('Error:', error));
    
                
                setTimeout(() => {
                    console.log('get token');
                    getToken();
                }, 20*60*1000 - 5000)
            
        }
      
    },[])


    function updateUser(data){
        
        const cookies = Cookies.get('auth') ? Cookies.get('auth'): null;

        fetch(process.env.REACT_APP_NOT_SECRET_CODE + "/api/users/update-profile", {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Bearer ' + cookies},
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
        .then(lastdata => {
            console.log('Update Success:', lastdata);
            setMessage('Update Success');
            setCurrentUser(prevState => {
                return {...prevState,
                    user:{
                        _id: data._id,
                        name: data.name, 
                        email: data.email, 
                        password: data.password
                    }};
            })
           history.push("/");
        })
        .catch(err =>{
            console.log(err);
            setMessage('update fail')
        });
    }

    //when getUser finish, run getTodo
    function getTodo(){
        const authCookie = Cookies.get('auth');

        if(authCookie){
            fetch(process.env.REACT_APP_NOT_SECRET_CODE + "/api/todos", {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json", 
                    'Authorization': 'Bearer ' + authCookie},                         
                })
                .then(res => {
                    //check res.ok
                    if(res.ok){
                        return res.json();
                    }
                //reject instead of throw
                return Promise.reject(res); 
                })
                .then((data) => setTodos(data))
                .catch(err => console.log(err))
        }
    
    }

    function addTodo(data){

        const cookies = Cookies.get('auth') ? Cookies.get('auth'): null;

        fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/todos', {
            method: 'POST', // or 'PUT'
            credentials: 'include',
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Bearer ' + cookies},       
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

             setTimeout(() => {
                getTodo();
             }, 500)
              
            })
            .catch(error => 
            console.error('Error:', error));
    }

    function updateTodo(data){

        //console.log(data);
        const cookies = Cookies.get('auth') ? Cookies.get('auth'): null;

        fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/todos', {
            method: 'PATCH', // or 'PUT'
            credentials: 'include',
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Bearer ' + cookies},         
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

             setTimeout(() => {
                getTodo();
             }, 500)
              
            })
            .catch(error => 
            console.error('Error:', error));
    }

    const deleteTodo = (data) => {

        const cookies = Cookies.get('auth') ? Cookies.get('auth'): null;

        fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/todos', {
            method: 'DELETE', // or 'PUT'
            credentials: 'include',
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Bearer ' + cookies},              
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

             setTimeout(() => {
                getTodo();
             }, 500)
              
            })
            .catch(error => 
            console.error('Error:', error));
    }


    useEffect(() => {

        const authCookies = Cookies.get('auth');
        
        //check private source and setHeader when match token
        const getUser = () => {

            fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/users', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json", 
                    'Authorization': 'Bearer ' + authCookies },
                })
                .then(res => {
                    //check res.ok
                    if(res.ok){
                        return res.json()
                    }
                    //reject instead of throw
                    return Promise.reject(res);
                })
                .then(data => {
                    if(!currentUser){
                        setCurrentUser(prevState => {
                            return {...prevState, user: data.user};
                        });
                    };
                //when getUser finshed and run getTodo
                getTodo();                               
                })      
                .catch(err => console.log(err)); 
               
        setLoading(false);
      
    //accessToken live 20m!
    //when timeout have to use gettoken(); get newtoken       
    setTimeout(() => {
        getToken();
    }, 20*60*1000 -10000)   
    }

    console.log(currentUser, 'currentUser')
        
    if(authCookies) {
        getUser();          
    } 
    setLoading(false)
    }, [currentUser, getToken])

  
   
    const value = {
        currentUser,
        setCurrentUser,
        message,
        setMessage,
        login,
        signup,
        logout,
        updateUser,
        getTodo,
        todos,
        addTodo,
        updateTodo,
        deleteTodo
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}