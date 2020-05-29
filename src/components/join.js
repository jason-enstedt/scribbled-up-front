import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import io from 'socket.io-client';
let socket;
const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [roomCheck, setRoomCheck] = useState(false);
    const [id, setId] = useState('');
    const ENDPOINT = 'https://scribbled-up.herokuapp.com/';

    useEffect(()=> {
    
        socket = io(ENDPOINT);
        socket.on('connect', () => setId(socket.id));

        
    }, []);
    useEffect(()=>{
        if(id !== ''){
            socket.emit('checkRoom', {room, id});
        }
    },[room])
    useEffect(()=>{
        socket.on('checkRoomResponse', (response)=>{
        setRoomCheck(response.response);
        });
        
    },[]);
    console.log(roomCheck);
    
   return(
    <div>
       <Link to="/" className="btn">Home</Link>
       <div><input placeholder="name" type="text" onChange={(event)=>setName(event.target.value)} value={name}></input></div>
       <div><input placeholder="room code" type="text" onChange={(event)=>setRoom(event.target.value)} value={room}></input></div>
       <div><p>{roomCheck ? '' : 'Please Enter a Valid Room Code or make your own room'}</p></div>
       <Link onClick={event=> (!name || !room || !roomCheck) ? event.preventDefault() : null}to={`/game?name=${name}&room=${room}`}>
           Join Game
       </Link>
    </div>
    )
}
export default Join;