import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

let inMemoryToken;

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
        const { accessToken, newToken, newUser: user} = data.data;

        inMemoryToken = {
            token: newToken.refresh_token,
            expiry: newToken.expires_at,
            acToken:  accessToken
        }
        
        setCurrentUser(prevState => {
            return {...prevState, user};
        });

        Cookies.set('auth', uuidv4())
        
        console.log(Cookies.get('auth'))
        getTodo();
    }

    function login(data) {

        const { accessToken, newToken, user } = data.data;
        //jwt timetstamp is ufc-base so have to according to timestamp to plus or cut
        inMemoryToken = {
            token: newToken.refresh_token,
            expiry: newToken.expires_at,
            acToken: accessToken
        }
        
        setCurrentUser(prevState => {
            return {...prevState, user};
        });
        
        //const event = new Date(inMemoryToken.expiry);

        //console.log(event, inMemoryToken.expiry);
        Cookies.set('auth', uuidv4()) 
       
        getTodo();
    }

   

    function logout(){

        fetch(process.env.REACT_APP_NOT_SECRET_CODE +'/api/users/logout', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({token: inMemoryToken.token})
        })
        .then(res => {
            //check res.ok
            if(res.ok){
                return res.text()
            }
            //reject instead of throw
            return Promise.reject(res);
        })
        .then(data =>console.log(data))
        .finally(() => {
            setCurrentUser('');
            Cookies.remove('auth')
        });
        
    }

    function resetPassword(email){

    }

    const getToken = useCallback(() => {
        
       const cookies = Cookies.get('auth');
       const token = inMemoryToken ? {token: inMemoryToken.token} : null;
        
        if(cookies !== undefined){
          
            fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/users/token', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(token),
                })
                .then(res => {
                    //check res.ok
                    if(res.ok){
                        return res.json()
                    }
                    //reject instead of throw
                    return Promise.reject(res);
                })
                .then(data => console.log(data))      
                .catch(error => console.error('Error:', error));
    
                
                setTimeout(() => {
                    console.log('get token');
                    getToken();
                }, 20*60*1000 - 5000)
            
        }
      
    },[])

    //check private source and setHeader when match token
    const getUser = useCallback(() => {
        return new Promise((resolve, reject) => {
            const token = inMemoryToken ? inMemoryToken.acToken : null;

            fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/users', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json", 
                    'Authorization': 'Bearer ' + token},
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
                resolve(data)
                //when getUser finshed and run getTodo
                getTodo();                               
                })      
                .catch(err => reject(err)); 
               
        setLoading(false);
      
    //accessToken live 20m!
    //when timeout have to use gettoken(); get newtoken       
    setTimeout(() => {
        getToken();
    }, 20*60*1000 -10000)

    })
      
    },[currentUser, getToken])


    function updateUser(data){
        
        const token = inMemoryToken ? inMemoryToken.acToken : null;

        fetch(process.env.REACT_APP_NOT_SECRET_CODE + "/api/users/update-profile", {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Bearer ' + token},
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
        const token = inMemoryToken ? inMemoryToken.acToken : null;

        if(authCookie){
            fetch(process.env.REACT_APP_NOT_SECRET_CODE + "/api/todos", {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json", 
                    'Authorization': 'Bearer ' + token},                         
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

        const token = inMemoryToken ? inMemoryToken.acToken : null;

        fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/todos', {
            method: 'POST', // or 'PUT'
            credentials: 'include',
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Bearer ' + token},       
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
            .catch((error) => {
            console.error('Error:', error);
            });
    }

    function updateTodo(data){

        //console.log(data);
        const token = inMemoryToken ? inMemoryToken.acToken : null;

        fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/todos', {
            method: 'PATCH', // or 'PUT'
            credentials: 'include',
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Bearer ' + token},         
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
            .catch((error) => {
            console.error('Error:', error);
            });
    }

    const deleteTodo = (data) => {
        console.log(data);
        const token = inMemoryToken ? inMemoryToken.acToken : null;

        fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/todos', {
            method: 'DELETE', // or 'PUT'
            credentials: 'include',
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Bearer ' + token},              
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
            .catch((error) => {
            console.error('Error:', error);
            });
    }


    useEffect(() => {

        const authCookies = Cookies.get('auth');
        
        async function getCookies(){
    
            const response = await fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/users/get-cookies', {
                    method: 'GET',
                    credentials: 'include',
                })
            const data = await response.json();

            console.log('Before promise call.', data)
            
            if(data === 'you have to login') return console.log('no cookies...')
            
            inMemoryToken = {
                token: data.cookies.retoken,
                acToken: data.cookies.token
                }
            //3. Await for the first function to complete
           const result = await getUser()
                
           console.log('Promise resolved: ' + result)
           
        }
        
        if(authCookies) {
            getCookies();          
        } 
        setLoading(false)
    }, [getUser])

  
   
    const value = {
        currentUser,
        setCurrentUser,
        message,
        setMessage,
        login,
        signup,
        logout,
        resetPassword,
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