import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import ContextAction from './Todo/ContextAction';

export default function SingleTodo({certainTodo}) {

    const { updateTodo } = useAuth();
    const [title, setTitle] = useState(certainTodo[0]?.title);
    const [contexts, setContexts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [contextAction, setContextaction] = useState(-1);
    const [width, setWidth] = useState(window.innerWidth);

    
    //detect mobile
    function handleWindowSizeChange() {

        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    let isMobile = (width <= 768);

    const titleKeyDown = (e) => {
        if(e.key === 'Enter'){
            if(contexts.length < 1) {
                setContextaction(-1);
                setContexts(oldArray => [...oldArray, '']);
            }
            contexts.splice(0, 0, '');
            setContexts([...contexts]);      
        }
    }

    const contextKeyDown = (e) => {
        //change focus
        const certainRow = e.target.parentElement.parentElement;
        //find index from dom HTMLCollection
        const findIndex = Array.from(certainRow.parentElement.children).indexOf(certainRow);
        let cloneContexts = contexts;
        
        if(e.key === 'Enter'){
            cloneContexts.splice(findIndex + 1, 0, '');
            setContexts([...cloneContexts])   
        }
    }


    const handleBlur = (e) => {
       setContextaction(-1)
    }


    const handleUpdate = async() => {
        let titleText = title;
        //let title = titleRef.current.value ? titleRef.current.value : certainTodo[0].title;
        let context = contexts.length ? contexts : certainTodo[0].context;
        
        const data = {
            _id: certainTodo[0]._id,
            title: titleText, 
            context: context
        };
        console.log(data)
        
       setLoading(true); 
       await updateTodo(data);    
       setLoading(false);
    
    }

    // context mutation
    const handleChange = (e) => {

        //const textCopy = e.target.nextSibling;
        //const textArea = e.target.value;
        //textCopy.innerHTML = textArea.replace(/\n/g, '<br/>')
        //change focus
        e.target.style.height = '';
        e.target.style.height = e.target.scrollHeight + "px";
        console.log(e.target.style.height)
        const certainRow = e.target.parentElement.parentElement;

        //find index from dom HTMLCollection
        const findIndex = Array.from(certainRow.parentElement.children).indexOf(certainRow);
     
        const cloneContext = contexts;
        cloneContext[findIndex] = e.target.value;
        setContexts(cloneContext);
       
    }


    const clickContext = (e) => {
         //change focus
         const certainRow = e.target.parentElement.parentElement;
         //find index from dom HTMLCollection
         const findIndex = Array.from(certainRow.parentElement.children).indexOf(certainRow);
         setContextaction(findIndex)
    }

    const deleteContext = () => {

        //target row remove 
        const filteredContext = contexts.filter((item, index) => index !== contextAction)
        setContexts(filteredContext)
    }

    const addContext = () => {
        console.log('add contexts...')
        contexts.splice(contextAction + 1, 0, '');
        setContexts([...contexts]);
    }


    useEffect(() => {
        if(certainTodo.length > 0){
          return  setContexts(certainTodo[0].context)
        }
    },[certainTodo])


    const handleTitleHight = (e) => {
        setTitle(e.target.value)
    }

    // title height revise
    function revise (element){

        if(isMobile){

        if(element < 18) return 50

        if(element < 35) return 70

        if(element < 51) return 90

        if(element < 68) return 120

        if(element < 80) return 130

        if(element < 100) return 210

        return element * 2

        }else{
           if(element < 20) return 50

           if(element < 68) return 110

           return element * 1.5
        }
    }

    return (
        <div className="whiteBoard">
            <div className="btntips" onClick={handleBlur}>
                <button className="updateBtn" disabled={loading} onClick={handleUpdate}>Update</button>
                <span className="tips">tips: create a new line when press "Enter" key</span>
            </div>

            <div className="main">

                <div className="title" onClick={handleBlur}>
                    <textarea name="title"
                    defaultValue={ title } style={{height: title ? revise(title.length) : '50px'}}  
                    //defaultValue only works for the initial load,
                    //You can get around this if you need to by passing a key to the wrapper component
                   placeholder="Title..." onChange={(handleTitleHight)} onKeyDown={titleKeyDown}/>
                </div>

                <div className="contextList">

                    {contexts.length > 0 && contexts.map((context, index) =>
                        
                        <div className="context" key={uuidv4()}>
                            {contextAction === index ? 
                            <ContextAction deleteContext={deleteContext} handleBlur={handleBlur}
                            addContext={addContext} /> : null}
                            <div className="contextMenu" onClick={clickContext}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </div>

                            <div className="contextText" onClick={handleBlur}>
                                <textarea
                                defaultValue={context} 
                                placeholder="Context..." onChange={handleChange} onKeyUp={contextKeyDown}/>
                                <div className="textCopy"></div>
                            </div>

                        </div>
                        
                    )}
                </div>
            </div>
                     
        </div>
    )
}
                