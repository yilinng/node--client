import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export default function SingleTodo({certainTodo, linkId}) {

    const { updateTodo } = useAuth();
    const titleRef = useRef('');
    const [contexts, setContexts] = useState([]);

 
    const handleKeyDown = async(e) => {
        
        //change focus
        const certainRow = e.target.parentElement;

        //find index from dom HTMLCollection
        const findIndex = Array.from(certainRow.parentElement.children).indexOf(certainRow);
        
        // set up the mutation observer
        const observer = new MutationObserver(function (mutations, me) {
            // `mutations` is an array of mutations that occurred
            // `me` is the MutationObserver instance
            const canvas = document.querySelector('.contextList');
            if (canvas) {
            console.log('have muation...', canvas.children, findIndex);
            if(findIndex < 1) return canvas.firstChild.firstChild.focus();
            
            console.log('context row..',canvas.children[findIndex+1]);

            me.disconnect(); // stop observing
            return;
            }
        });
            
        // start observing
        observer.observe(document, {
            childList: true,
            subtree: true
        });
        
        if(e.key === 'Enter'){
            console.log('enter work...');
            //if not have any context
            if(contexts.length < 1) return setContexts(oldArray => [...oldArray, '']);

             //row -> title
             if(certainRow.previousSibling === null){
               
                if(certainRow.nextElementSibling.firstChild.nodeName === "DIV" ){
    
                    contexts.unshift('');
                    setContexts([...contexts])
 
                //certainRow.nextElementSibling.firstChild.firstChild.focus();
              
                console.log('same title', contexts); 
                return false;
                }
              
            }
            
            //last row
            if(certainRow.nextElementSibling === null) {

                //ensure no have value
                if(!e.target.value) {
                    setContexts(oldArray => [...oldArray, '']);
                    console.log('last context row no value...', contexts, certainRow.parentElement.children);
                    return false;     
                }
                    contexts[findIndex] = e.target.value;
                    setContexts(contexts);
                    setContexts(oldArray => [...oldArray, '']);
                    console.log('last context row have value...', contexts);
                
            } 

            //ensure no have value
            if(!e.target.value){
                // target row next add new row
                contexts.splice(findIndex+1, 0, '');
                setContexts([...contexts]);
                console.log('same context row no value', contexts, findIndex);
            }
                
                contexts[findIndex] = e.target.value;
                setContexts(contexts);
                contexts.splice(findIndex+1, 0, '');
                setContexts([...contexts]);
                console.log('same context row have value', contexts, findIndex);
                //certainRow.firstChild.blur();
         
        };
        
       
        if(e.key === 'ArrowUp'){
            //row => title
            if(certainRow.previousSibling === null){

               return certainRow.parentElement.previousSibling.lastChild.focus();

            }else{

                certainRow.previousSibling.lastChild.focus();
            }
            console.log(' ArrowUp', certainRow.previousSibling, certainRow.parentElement.previousSibling)
           
        }
 
        if(e.key === 'ArrowDown'){

            //if not have any context
            if(contexts.length < 1) return false;
            //last row 
            if(certainRow.nextElementSibling === null){

               console.log('next is null');

            }else{
            console.log('ArrowDown', certainRow.nextElementSibling.firstChild);

                if(certainRow.nextElementSibling.firstChild.nodeName === "DIV"){
                    console.log('close title');
                    certainRow.nextElementSibling.firstChild.firstChild.focus();
                }else{
                    console.log('same context');
                    certainRow.nextElementSibling.firstChild.focus();
                }
            }
           
        }
        
    }

    const handleOnBlur = index => e => {
        const targetInput = e.target.value;
        contexts[index] = targetInput;
       setContexts(contexts)
       //handleUpdate()
       
    }

    const handleUpdate = () => {

        let title = titleRef.current.value ? titleRef.current.value : certainTodo[0].title;
        let context = contexts.length ? contexts : certainTodo[0].context;
        
        const data = {
            _id: certainTodo[0]._id,
            title: title, 
            context: context
        };

       updateTodo(data)    
      
    }

    useEffect(() => {
        if(certainTodo.length > 0){
          return  setContexts(certainTodo[0].context)
        }
    },[])

    /*
    useEffect(() => {
        //https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining
        console.log(todo[0]?.title ? todo[0].title : titleRef.current.value)
    },[todo])
    */

    return (
        <div className="whiteBoard">
            
                 <div className="title">
                 <input type="text" id="title" name="title"
                  defaultValue={ certainTodo[0]?.title ? certainTodo[0].title : titleRef.current.value }   
                 //defaultValue only works for the initial load,
                 //You can get around this if you need to by passing a key to the wrapper component
                 ref={titleRef} placeholder="Title..." onKeyDown={handleKeyDown}/>
             </div>
             <div className="contextList">
                 {contexts.length > 0 && contexts.map((context, index) =>
                     
                    <div className="context" key={uuidv4()}>
                         <input type="text" name="context" 
                         defaultValue={context} 
                         placeholder="Context..." onKeyDown={handleKeyDown} onBlur={handleOnBlur(index)}/>
                    </div>
                     
                 )}
               
             </div>
                     
        </div>
    )
}
                