import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export default function SingleTodo({certainTodo}) {

    const { updateTodo } = useAuth();
    const titleRef = useRef('');
    const [contexts, setContexts] = useState([]);
    const [loading, setLoading] = useState(false)

 
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
            //console.log('have muation...', canvas.children, findIndex);
            if(!canvas.children.length) return false;
            if(e.target.getAttribute('name') === 'title') {
                //console.log('event target on title')               
               return canvas.children ? canvas.children[0]?.children[0].focus(): false
            }
            
            //console.log('context row..',canvas.children[findIndex+1]);
            canvas.children[findIndex+1]? canvas.children[findIndex+1].children[0].focus(): console.log('not found children')
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
            //console.log('enter work...');
            //if not have any context
            if(contexts.length < 1) return setContexts(oldArray => [...oldArray, '']);
            
            //last row
            if(certainRow.nextElementSibling === null) {

                //ensure no have value
                if(!e.target.value) {
                    setContexts(oldArray => [...oldArray, '']);
                    //console.log('last context row no value...', contexts, certainRow.parentElement.children);
                    return false;     
                }
                    contexts[findIndex] = e.target.value;
                    setContexts(contexts);
                    setContexts(oldArray => [...oldArray, '']);
                    //console.log('last context row have value...', contexts);
                
            } 

            //ensure no have value
            if(!e.target.value){
                // target row next add new row
                contexts.splice(findIndex+1, 0, '');
                setContexts([...contexts]);
                //console.log('same context row no value', contexts, findIndex);
            }
            
            if(e.target.getAttribute('name') === 'title'){
                contexts.splice(0, 0, '');
                setContexts([...contexts]);
                //console.log('on title row...');
                return;
            }
                contexts[findIndex] = e.target.value;
                setContexts(contexts);
                contexts.splice(findIndex+1, 0, '');
                setContexts([...contexts]);
                //console.log('same context row have value', contexts, findIndex);
                
         
        };
        
       
        if(e.key === 'ArrowUp'){
            //row => title
            if(certainRow.previousSibling === null){

               return certainRow.parentElement.previousSibling.lastChild.focus();

            }else{

                certainRow.previousSibling.lastChild.focus();
            }
            //console.log(' ArrowUp', certainRow.previousSibling, certainRow.parentElement.previousSibling)
           
        }
 
        if(e.key === 'ArrowDown'){

            //if not have any context
            if(contexts.length < 1) return false;
            //last row 
            if(certainRow.nextElementSibling === null){

               //console.log('next is null');

            }else{
            //console.log('ArrowDown', certainRow.nextElementSibling.firstChild);

                if(certainRow.nextElementSibling.firstChild.nodeName === "DIV"){
                    //console.log('close title');
                    certainRow.nextElementSibling.firstChild.firstChild.focus();
                }else{
                    //console.log('same context');
                    certainRow.nextElementSibling.firstChild.focus();
                }
            }
           
        }

        if(e.key === 'Delete'){
            //console.log('delete key...');
            //ensure no have value
            if(!e.target.value){
                //target row remove 
                contexts.splice(findIndex, 1);
                setContexts([...contexts]);
                //console.log('same context row no value', contexts, findIndex);
            }
        }
        
    }


    const handleUpdate = async() => {

        let title = titleRef.current.value ? titleRef.current.value : certainTodo[0].title;
        let context = contexts.length ? contexts : certainTodo[0].context;
        
        const data = {
            _id: certainTodo[0]._id,
            title: title, 
            context: context
        };
        console.log(data)
        
       setLoading(true); 
       await updateTodo(data);    
       setLoading(false);
    
    }

    const handleChange = (e) => {
         //change focus
         const certainRow = e.target.parentElement;

         //find index from dom HTMLCollection
         const findIndex = Array.from(certainRow.parentElement.children).indexOf(certainRow);
     
        contexts[findIndex] = e.target.value;
        setContexts(contexts);
    }

    useEffect(() => {
        if(certainTodo.length > 0){
          return  setContexts(certainTodo[0].context)
        }
    },[certainTodo])

    /*
    useEffect(() => {
        //https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining
        console.log(todo[0]?.title ? todo[0].title : titleRef.current.value)
    },[todo])
    */

    return (
        <div className="whiteBoard">
            <button className="updateBtn" disabled={loading} onClick={handleUpdate}>Update</button>
            <div className="title">
                <input type="text" id="title" name="title"
                  defaultValue={ certainTodo[0]?.title ? certainTodo[0].title: titleRef.current.value }   
                 //defaultValue only works for the initial load,
                 //You can get around this if you need to by passing a key to the wrapper component
                ref={titleRef} placeholder="Title..." onKeyDown={handleKeyDown}/>
            </div>
            <div className="contextList">
                 {contexts.length > 0 && contexts.map((context, index) =>
                     
                    <div className="context" key={uuidv4()}>
                         <input type="text" name="context" 
                         defaultValue={context} 
                         placeholder="Context..." onKeyDown={handleKeyDown} onChange={handleChange}/>
                    </div>
                     
                )}
               
            </div>
                     
        </div>
    )
}
                