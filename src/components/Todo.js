import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, Redirect } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SingleTodo from './SingleTodo';
import Action from './Todo/Action';

export default function Todo() {

    const { currentUser, getTodo, todos, addTodo } = useAuth();
    const [loading, setLoading] = useState(false);
    const [linkId, setLinkId] = useState('');
    const [showSide, setShowSide] = useState(false);
    const [showAction, setShowAction] = useState([]);
    const [actionNumber, setActionNumber] = useState(0);
    
    //get data from same user_id
  
    const filterTodos = todos.length ? Array.from(todos).filter(todo => 
      todo.user_id === currentUser.user._id):[];

    const certainTodo = filterTodos.length ? Array.from(filterTodos).filter(todo => 
      todo._id === linkId): [];

    const handleAdd = async() => {

     let id = uuidv4(); 
      const data = {
            _id: id,
            title: "",
            username: currentUser.user.name,
            user_id: currentUser.user._id
      };

      setLinkId(id);
      setLoading(true);

      console.log(data);
      await addTodo(data);
      await getTodo();
      
      setLoading(false);
      
      showAction[filterTodos.length] = false;
      setShowAction(showAction);

    }
    
    const handleBlur = (index) => {
      //To have Onblur on an element it should receive focus first, 
      //Div elements don't receive focus by default. You can add tabindex="0"
      console.log('on blur');
      showAction[index] = false;
      setShowAction(showAction);
      setActionNumber(actionNumber-1);
    }

    const HandleAction = (index) => {
      //filter except index
      let filterAction = showAction.filter((item, idx) => idx !== index);
      if(filterAction.includes(true)) return false;
      
      if(showAction[index] === false){
        showAction[index] = true;
        setShowAction(showAction);
        setActionNumber(actionNumber+1);
      }else{
        showAction[index] = false;
        setShowAction(showAction);
        setActionNumber(actionNumber-1)
      }
      
    }

    useEffect(() => {
      
      function fetchTodo () {
      
        if(showAction.length !== filterTodos.length) return false;
        let i = filterTodos.length;
        while(i){// when i becomes 0, the condition becomes falsy, and the loop stops
          setShowAction(oldArray => [...oldArray, false]);
          i--;
        }
      }
      fetchTodo();
    }, []);

    
    //useffect work with variable, not work with array
    useEffect(() => {
      console.log(showAction, actionNumber)
    },[actionNumber, showAction])
    
    if (!currentUser) {
        return <Redirect to="/login" />;
      }
  
    return (
        <div className="container">
            <header>
                <span className="sideBtn" onClick={() =>setShowSide(!showSide)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </span>

                <span className="title">{certainTodo[0]?.title ? certainTodo[0].title: 'Untitle'}</span> 

                <span className="shareBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>                   
                </span>
            </header>
        <div className="todo">
         <div className={showSide ? 'sideBarTodo active': 'sideBarTodo'}>
            <div className="list">
            <h3>{currentUser.user.name} todo</h3>
      {
        filterTodos && filterTodos.length > 0 ?
            (
              filterTodos.map((da, index) => {
                return (
                  <div key={da._id} className="li" onClick={() => setLinkId(da._id)}>
                        <strong>
                           <span>{  da.title || 'Untitle' }</span>
                        </strong>                         
                        <span className="minMenu" tabIndex="0" onClick={() => HandleAction(index)} onBlur={() => handleBlur(index)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                          { showAction[index] === true  ? <Action linkId={linkId}/> : ''}  
                        </span>
                  </div>                                   
                )
              })

            )
            :
            (
              <span>No todo(s) left</span>
            )
      }

          <button className="addOne" type="button" disabled={loading} onClick={handleAdd}>+ Add a page</button>
         </div>
            <Link to="/">Cancel</Link>
         </div>
           { linkId && certainTodo && 
           <SingleTodo certainTodo={certainTodo} key={linkId}/> } 
        </div>
        </div>

    )
}
