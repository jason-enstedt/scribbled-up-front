import React, {useState, useEffect, useLayoutEffect, Redirect} from 'react';
import io from 'socket.io-client';
import CanvasDraw from "react-canvas-draw";
import EndGame from "./endGame";
//import Draw from './draw';

let socket;
const Game = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [drawing, setDrawing] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    //const ENDPOINT = 'localhost:5000';
    const ENDPOINT = 'https://scribbled-up.herokuapp.com/'
    const [game, setGame] = useState(false);
    //const [chain, setChain] = useState([]);
    //const [link, setLink] = useState('');
    const [time, setTime] = useState(0);
    const [draw, setDraw] = useState(false);
    const [phrase, setPhrase] = useState(false);
    const [initialMessage, setInitialMessage] = useState(true);
    const [receivedDrawing, setReceivedDrawing] = useState('{"lines":[],"width":150,"height":752}');
    const [showDrawing, setShowDrawing] = useState(false);
    const [idMarker, setIdMarker] = useState('');
    const [gameEnd, setGameEnd] = useState(false);
    const [myId, setMyId] = useState('');
    const [counter, setCounter] = useState(1);

    // useEffect(()=>{
    //     if(users.length > 0 && counter === 0 && myId === ''){
    //     const MYID = () => users.find((user)=> user.name === name);
    //     let offID = MYID.id;
        
    //         setMyId(offID);
        
        
    //     setCounter(99);
        
    // }
    // },[users, game]);
    
    //console.log(users);
    
    
    useEffect(()=> {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const name = urlParams.get('name');
        const room = urlParams.get('room');
        const type = urlParams.get('type');

        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);
        if(type == 'admin'){
            setIsAdmin(true);
        }
        socket.emit('join', {name, room}, () =>{
            
        });
       
        

        return () =>{
            socket.emit('disconnect');

            socket.off();
        }

    }, [ENDPOINT]);
    // useEffect(()=>{
    //     socket.on('addChain',(message)=>{
    //         console.log(message.payload);
    //         setChain([...chain, message.payload]);
    //     })
    //     console.log(chain);
    // },[chain]);

    //update messages and users
    useEffect(()=>{
        socket.on('message', (message)=>{
           // console.log(message.user);
            setMessages([message]);
            setIdMarker(message.user);
            setCounter(message.counter + 1);
            console.log("counter +");
            setDraw(true);
            setPhrase(false);
            setReceivedDrawing('{"lines":[],"width":150,"height":752}');
            setShowDrawing(false);
            //socket.emit('sendChain', ({payload:message.text, id:message.user}));
                
            
        
        })
    }, [messages]);

    useEffect(()=>{
        socket.on("roomData", ({users, id})=>{
            setUsers(users);
            //setMyId(id);

            
        })
    },[users]);
    
    useEffect(()=>{
        socket.on('socketId', (id)=>{
            setMyId(id);
        })
    },[])

    useEffect(()=>{
        socket.on('isAdmin', (message)=>{
            setIsAdmin(message);
        });
       
        
        
    },[users]);

    if(draw){
        if(!showDrawing){
            window.addEventListener('touchmove', function (event) {
        event.preventDefault()
      }, {passive: false});
        }
    }
    //console.log(users);
    // useEffect(()=>{
    //     if(users){
    //         var myUser = users.find((user) => user.name === name);
    //         if(myUser == undefined){

    //         }else{
    //            // console.log(myUser.type);
    //             if(myUser.type == 'admin'){
    //                 setIsAdmin(true);
    //             }
    //         }
            
    //     }
    // },[users])
    // console.log(isAdmin);
    //send a phrase or guess to next user
    const sendMessage = (event) =>{
        event.preventDefault();

        if(message){
            // if(idMarker === ''){
            //     var newId = idMarker;
            // }else{
            //     var newId = '';
            // }
             
            if(initialMessage){
                console.log(counter);
                socket.emit('sendMessage', {message, idthing:myId, counter:counter}, () => setMessage(''), ()=> setCounter(counter + 1));
            }else{
               console.log("message sent");
               console.log(idMarker);
               console.log(counter);
                socket.emit('sendMessage', {message, idthing:idMarker, counter:counter}, () => setMessage(''), ()=> setCounter(counter + 1));
            }
            
            //setTime(15);
        }
        
    }
    //send your drawing to next user
    const sendDrawing = (event) =>{
        event.preventDefault();
        if(drawing){
            console.log(counter);
            //idMarker is not being changed, always will be empty string
            socket.emit('sendDrawing', {drawing, idMarker, counter:counter}, () => setDrawing(''), ()=> setCounter(counter + 1));
            //setTime(15);
        }
    }
    //on drawing receive set the state for recevied drawing
    useEffect(()=>{
        socket.on('receiveDrawing', (message)=>{
            setPhrase(true);
            setReceivedDrawing(message.drawing);
            console.log(message.id);
            setIdMarker(message.id);
            setShowDrawing(true);
            setCounter(message.counter + 1);
           console.log(counter);
           setInitialMessage(false);
           setMessage('');
           //socket.emit('sendChain',({payload:message.drawing, id:message.id}));
        })
    },[receivedDrawing])

    //starts the game for everyone
    const startGame = (event) => {
        event.preventDefault();
        //console.log('game started');
        let gameInfo = true;
        socket.emit('startGame', gameInfo);
    }
    useEffect(()=>{
        socket.on('endGame', ()=>{
            setGameEnd(true);
        })
    })
    //when game is started start the timer
    useEffect(()=>{
        socket.on('gameStart', (start)=>{
            
            setGame(start);
            setPhrase(true);
            //setTime(10);
        })
    },[]);

    //timer starts, runs senddrawing or sendmessage depending on state
    // useEffect(()=>{
    //     if(game){
    //         if(time !== 0){
    //             setTimeout(()=>{
    //             setTime(time - 1);
    //         },1000)}else{
    //             if(phrase){
    //                 sendMessage();
                    
                    
    //             }else{
                    
    //                 sendDrawing();
    //                 //setDraw(false);
                    
    //             }
                
    //         }
            
    //     }
    // }, [time])
    
   
   
        const [color, setColor] = useState("#444");
        const [brush, setBrush] = useState(10);
        const drawId = React.createRef();
        const colors = [
            "black","white","blue", "orange", "yellow", "green", "red", "purple", "brown"
        ]
        
        //creates color buttons based off the colors array
        const createColors = colors.map((color)=>(<button key={color} onClick={()=> changeColor(color)} style={{backgroundColor:color}} className={'color-btn'}>
        </button>))

        //changes the current color
        const changeColor = (color) =>{
            setColor(color);
        }
        
        //saves the current drawing, last save will be sent. Change to outsave
         const finishDrawing = () =>{
             
             setDrawing(drawId.current.getSaveData());
         }
     

    return(
        <div>
            <div className="code-bar">
                <p className="code">Code:<span className="code-text">{room}...</span> </p>
                {game ? <p className="countdown"><span>{time}</span>s</p> : ''}
            </div>

            {!gameEnd ?  <div>



            {game ? '': 
           <div className="player-list">
               
                <h2>Players</h2>
                <ul>
                    {users.slice(0).map((user, index)=><li key={user.name}>{index + 1 + '. '}{user.name} {user.type == 'admin' ? `(${user.type})` : ''}</li>)}
                </ul>
                
            </div>
            }

           {showDrawing ? '' :
            <div className="messages">
                {messages.map((message, i)=> <p key={i}>{ message.text}</p>)}
            </div> 
            }
            

            {phrase ? 
            <div className="starting-phrase">
                <h2>{initialMessage ? 'Enter your starting phrase here...':"Enter your guess here..."}</h2>
                <input 
                placeholder="Phrase..."
                className="text-box"
                value={message} 
                onChange={(event) => setMessage(event.target.value)} 
                // onKeyPress={event=> event.key === 'Enter' ? sendMessage(event) : null}
                />
                <button onClick={sendMessage}>Send</button>
            </div> 
            :''}

            {draw ? 
            <div className="draw">
                
                <CanvasDraw 
                onChange={finishDrawing}
                className="canvasDraw"
                ref={drawId}
                hideGrid={true}
                brushColor={color}
                lazyRadius={0}
                canvasWidth={window.innerWidth}
                canvasHeight={window.innerHeight - 350}
                brushRadius={brush}
                hideInterface={true}
                saveData={showDrawing ? receivedDrawing : '{"lines":[],"width":150,"height":752}'}
                disabled={showDrawing ? true : false}
                />
                
            {showDrawing ?
             '' : 
             <div>
                <div className="buttons">
                    {createColors}
                </div>   
                <input type="range" min="1" max="40" className="slider" value={brush} onChange={(event)=>setBrush(event.target.value)}/> 
                <div className="high-buttons">
                    <button
                    className={'color-btn', 'super-btn'}
                    style={{backgroundColor:''}}
                        onClick={() => drawId.current.undo()
                        }
                    >
                    <img src={process.env.PUBLIC_URL + '/undo.png'} />
                    </button>
                    <button onClick={sendDrawing}>Send</button>
                    <button
                    className={'color-btn','super-btn'}
                        onClick={() => drawId.current.clear()
                        }
                    >
                    <img src={process.env.PUBLIC_URL + '/bin.png'} />
                    </button>
                </div>  
             </div>
            }
            
            </div> :''}

            {game ? '' :
            <div className="instructions">
                <h3>Instructions</h3>
                <p>Everyone will enter a phrase that another person will have to draw. The phrase turns into a drawing, which then turns into another phrase. This goes on until your original phrase comes back to you. See how crazy it turned into!</p>
                <p></p>
            </div>
            }
            
            

            {game ? '':
            <div className="start-container">
                {isAdmin ? <button className="start-btn" onClick={startGame}>Start the Game</button> : <p>Waiting for the Admin to start game...</p>}
                
            </div>
            }
            
            </div> : <EndGame data={users} id={myId} />}
        </div>
        
    )
}
export default Game;