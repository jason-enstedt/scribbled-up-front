import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
const Create = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    

    useEffect(()=>{
        setRoom(Math.floor(Math.random() * (9999 - 1000 + 1) + 1000));
    },[])
    
return(

    <div className="create">
       
       <div><input placeholder="name" type="text" onChange={(event)=>setName(event.target.value)} value={name}></input></div>
       
       <Link className="btn" onClick={event=> (!name || !room) ? event.preventDefault() : null}to={`/game?type=admin&name=${name}&room=${room}`}>
           Create Game
       </Link>
        <div className="back">
            <Link to="/">Go Back</Link>
        </div>
       
       
       
    </div>
)}
export default Create;