import React, { useContext, useState, useEffect, useCallback} from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

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

        getUser();
        
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
        getUser();

    }

    function getCookies(){

        const authCookies = Cookies.get('auth');

        if(authCookies){
            fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/users/get-cookies', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
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
                inMemoryToken = {
                    token: data.cookies.retoken,
                    acToken: data.cookies.token
                }
            })
            .finally(() => {
                console.log(inMemoryToken)
            });
        }
      
    }

    function logout(){
        

        fetch(process.env.REACT_APP_NOT_SECRET_CODE +'/api/users/logout', {
        method: 'DELETE',
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
                headers: {
                    "Content-Type": "application/json" 
                },
                withCredentials: true,
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
    const getUser = useCallback(() =>{
        
        const authCookie = Cookies.get('auth');
        const token = inMemoryToken ? inMemoryToken.acToken : null;

        if(authCookie){

            fetch(process.env.REACT_APP_NOT_SECRET_CODE + '/api/users', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json", 
                    'Authorization': 'Bearer ' + token},
                withCredentials: true,
                credentials: 'include',
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
            }
        
               
        setLoading(false);

              
    //accessToken live 20m!
    //when timeout have to use gettoken(); get newtoken       
    setTimeout(() => {
        getToken();
    }, 20*60*1000 -10000)
    
    },[currentUser, getToken])

    function updateUser(data){
        
        const token = inMemoryToken ? inMemoryToken.acToken : null;

        fetch(process.env.REACT_APP_NOT_SECRET_CODE + "/api/users/update-profile", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Bearer ' + token},
            withCredentials: true,
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
                    headers: {
                        "Content-Type": "application/json", 
                        'Authorization': 'Bearer ' + token},
                    withCredentials: true,
                    credentials: 'include'
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
            credentials: "include",
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Bearer ' + token},
            withCredentials: true,
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
            credentials: "include",
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Bearer ' + token},
            withCredentials: true,
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
            credentials: "include",
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Bearer ' + token},
            withCredentials: true,
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
        if(authCookies) {
            getCookies();
            //when get cookies ,wait 500ms to get data
            setTimeout(() => {
                getUser();
            }, 500);
        }else{
            getUser();
        } 
       
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