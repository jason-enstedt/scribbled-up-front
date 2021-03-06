import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import io from 'socket.io-client';
let socket;
const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [roomCheck, setRoomCheck] = useState(false);
    const [id, setId] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  // const ENDPOINT = 'localhost:5000';
    const ENDPOINT = 'https://scribbled-up.herokuapp.com/'

    useEffect(()=> {
    
        socket = io(ENDPOINT);
        socket.on('connect', () => setId(socket.id));

        
    }, []);
    useEffect(()=>{
        if(id !== ''){
            //let lowerRoom = room.toLowerCase();
            console.log(room);
            console.log(room.toLowerCase())
            socket.emit('checkRoom', {room, id});
        }
    },[room])
    useEffect(()=>{
        socket.on('checkRoomResponse', (response)=>{
        setRoomCheck(response.response);
        if(response.response == false){
            setError(true);
            setErrorMessage(response.error);
        }
        });
        
    },[]);
    
    
   return(
    <div className="join">
        <p>Join a Room that your friend has made, or <Link className="text-link" to="/create">CREATE</Link> one</p>
       <div className="join-inputs">
           <input placeholder="name..." maxLength="20" type="text" onChange={(event)=>setName(event.target.value)} value={name}></input>
        <input placeholder="room code..." maxLength="4" type="text" onChange={(event)=>setRoom(event.target.value)} value={room}></input>
       {error ? <p className="error">{roomCheck ? '' : errorMessage}</p> : ""}
       </div>
       <div></div>
       <Link className={roomCheck ? 'btn' : 'fake-btn'} onClick={event=> (!name || !room || !roomCheck) ? event.preventDefault() : null}to={`/game?name=${name}&room=${room}`}>
           Join Game
       </Link>
       <div className="back">
            <Link to="/">Go Back</Link>
        </div>
    </div>
    )
}
export default Join;