import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SingleTodo({filterTodos, linkId}) {

    //if have project match id, new project have to use new one
    const todo = Array.from(filterTodos).filter(todo => {
        return todo._id === linkId
    });
    
    const { updateTodo } = useAuth();
    const titleRef = useRef('');
    const contextRef = useRef('');
    const [contexts, setContexts] = useState([]);
    
    const handleKeyDown = (e) => {
        //key: ArrowUp ArrowDown
        if(e.key === 'Enter'){
            console.log('enter work...');
            setContexts(oldArray => [...oldArray, ''])
        };

    }

    const handleOnBlur = index => e => {
        const targetInput = e.target.value;
        contexts[index] = targetInput;
       setContexts(contexts)
       console.log(contexts)
       //handleUpdate()
       
    }

    const handleUpdate = () => {

        const data = {
            _id: todo[0]._id,
            title: todo[0].title, 
            context: contexts
        };

        updateTodo(data)    
      
    }

    useEffect(() => {
        if(todo.length > 0){
          return  setContexts(todo[0].context)
        }
        
        console.log(contexts, todo);

    },[linkId])

    
    return (
        <div className="whiteBoard">
            
            { todo.length > 0 ? (
                <>
                 <div className="title">
                 <input type="text" id="title" name="title"
                  defaultValue={todo[0].title}   
                 //defaultValue only works for the initial load,
                 //You can get around this if you need to by passing a key to the wrapper component
                 ref={titleRef} placeholder="Title..." onKeyDown={handleKeyDown}/>
             </div>
             <div className="contextList">
                 {contexts.length > 0 && contexts.map((context, index) =>
                     <>
                       <div className="context" key={index}>
                         <input type="text" name="context" 
                         defaultValue={context} ref={contextRef}
                         placeholder="Context..." onKeyDown={handleKeyDown} onBlur={handleOnBlur(index)}/>
                     </div>
                     </>
                 )}
               
             </div>
            </>     
            ) : (
                <>
                <div className="title">
                <input type="text" id="title" name="title"
                //defaultValue only works for the initial load,
                //You can get around this if you need to by passing a key to the wrapper component
                ref={titleRef} placeholder="Title..." onKeyDown={handleKeyDown}/>
            </div>
            <div className="contextList">
                {contexts.length > 0 && contexts.map((context, index) =>
                    <>
                      <div className="context" key={index}>
                        <input type="text" name="context" 
                        defaultValue={context} ref={contextRef}
                        placeholder="Context..." onKeyDown={handleKeyDown} onBlur={handleOnBlur(index)}/>
                    </div>
                    </>
                )}
              
            </div>
            </>    
            )}
                     
        </div>
    )
}
