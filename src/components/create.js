import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
const Create = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"];
// and then just do:
        
    useEffect(()=>{
        setRoom([...Array(5)].map(i=>chars[Math.random()*chars.length|0]).join``);
    },[])
    
return(

    <div>
       <Link to="/" className="btn">Home</Link>
       <div><input placeholder="name" type="text" onChange={(event)=>setName(event.target.value)} value={name}></input></div>
       
       <Link onClick={event=> (!name || !room) ? event.preventDefault() : null}to={`/game?name=${name}&room=${room}`}>
           Create Game
       </Link>
    </div>
)}
export default Create;