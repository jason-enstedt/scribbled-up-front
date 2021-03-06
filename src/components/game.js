import React, {useState, useEffect} from 'react';
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
    // const [time, setTime] = useState(0);
    const [draw, setDraw] = useState(false);
    const [phrase, setPhrase] = useState(false);
    const [initialMessage, setInitialMessage] = useState(true);
    const [receivedDrawing, setReceivedDrawing] = useState('{"lines":[],"width":150,"height":752}');
    const [showDrawing, setShowDrawing] = useState(false);
    const [idMarker, setIdMarker] = useState('');
    const [gameEnd, setGameEnd] = useState(false);
    const [myId, setMyId] = useState('');
    const [counter, setCounter] = useState(1);
    const [showMessageInput, setShowMessageInput] = useState(true);
    const [showDrawingInput, setShowDrawingInput] = useState(true);
    const [pauseGame, setPauseGame] = useState(false);

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
        if(type === 'admin'){
            setIsAdmin(true);
        }
        socket.emit('join', {name, room}, () =>{
            
        });
       
        

        return () =>{
            socket.emit('disconnect', {id:myId, room:room});

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
           setShowDrawingInput(true);
            setMessages([message]);
            setIdMarker(message.user);
            setCounter(message.counter + 1);
           // console.log("counter +");
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

            // users.forEach((val)=>{
            //     val.game
            // })

            
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

    useEffect(()=>{
        socket.on('userLeft',() =>{
            setPauseGame(true);
            console.log("paused");
        });
    })
    
    //send a phrase or guess to next user
    const sendMessage = (event) =>{
        event.preventDefault();

        if(message){
            // if(idMarker === ''){
            //     var newId = idMarker;
            // }else{
            //     var newId = '';
            // }
             setShowMessageInput(false);
            if(initialMessage){
               // console.log(counter);
                socket.emit('sendMessage', {message, idthing:myId, counter:counter}, () => setMessage(''), ()=> setCounter(counter + 1));
            }else{
               //console.log("message sent");
               //console.log(idMarker);
               //console.log(counter);
                socket.emit('sendMessage', {message, idthing:idMarker, counter:counter}, () => setMessage(''), ()=> setCounter(counter + 1));
            }
            
            //setTime(15);
        }
        
    }
    //send your drawing to next user
    const sendDrawing = (event) =>{
        event.preventDefault();
        if(drawing){
            setShowDrawingInput(false);
           // console.log(counter);
            //idMarker is not being changed, always will be empty string
            socket.emit('sendDrawing', {drawing, idMarker, counter:counter}, () => setDrawing(''), ()=> setCounter(counter + 1));
            //setTime(15);
        }
    }
    //on drawing receive set the state for recevied drawing
    useEffect(()=>{
        socket.on('receiveDrawing', (message)=>{
            setShowDrawingInput(true);
            setShowMessageInput(true);
            setPhrase(true);
            setReceivedDrawing(message.drawing);
            //console.log(message.id);
            setIdMarker(message.id);
            setShowDrawing(true);
            setCounter(message.counter + 1);
           //console.log(counter);
           setInitialMessage(false);
           setMessage('');
           //socket.emit('sendChain',({payload:message.drawing, id:message.id}));
        })
    },[receivedDrawing])

    if(draw){
        if(!showDrawing){
            window.addEventListener('touchmove', function (event) {
            event.preventDefault()
            }, {passive: false});
        }
    }
    
    useEffect(()=>{
            window.addEventListener('touchmove', function (event) {
            event.preventDefault()
            }, {passive: true});
    
    },[gameEnd])
    useEffect(()=>{
        var element = document.getElementById("App");
        element.classList.add("invert");
    },[]);
    
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
        <div className="game-container">
            {!draw ?<div className="code-bar">
                <p className="code">Code:<span className="code-text">{room}</span> </p>
            </div> :'' }
            

            {!gameEnd ?  <div className="test">



            {game ? '': 
           <div className="player-list">
               
                <h2>Players</h2>
                {users.length > 0 ?<ul>
                    {users.slice(0).map((user, index)=><li key={user.name}>{index + 1 + '. '}{user.name} {user.type == 'admin' ? `(${user.type})` : ''}</li>)}
                </ul> : <img  src={process.env.PUBLIC_URL + '/loading.png'} className="loading"></img>}
                
                
            </div>
            }

           {showDrawing ? '' :
            <div className="messages">
                {messages.map((message, i)=> <p key={i}>{ message.text}</p>)}
            </div> 
            }
            

            {phrase ? 
            <div>
                {showMessageInput ? <div className="starting-phrase">
                    <h2>{initialMessage ? 'Enter your starting phrase here...':"Enter your guess here..."}</h2>
                    <input 
                    placeholder="Phrase..."
                    className="text-box"
                    value={message} 
                    onChange={(event) => setMessage(event.target.value)} 
                    // onKeyPress={event=> event.key === 'Enter' ? sendMessage(event) : null}
                    />
                    <button onClick={sendMessage} className="btn">Send</button>
                </div> : <p className="message-sent">Message Sent!<br /> Waiting for other players...</p>}
                
            </div>
            :''}

            {draw ? 
            <div className="draw">
                {showDrawingInput ?<div>
                    <CanvasDraw 
                    onChange={finishDrawing}
                    className="canvasDraw"
                    ref={drawId}
                    hideGrid={true}
                    brushColor={color}
                    lazyRadius={0}
                    canvasWidth={window.innerWidth}
                    canvasHeight={window.innerWidth * 1.2}
                    brushRadius={brush}
                    hideInterface={true}
                    saveData={showDrawing ? receivedDrawing : '{"lines":[],"width":150,"height":752}'}
                    disabled={showDrawing ? true : false}
                    />
                    
                {showDrawing ?
                '' : 
                <div className="controls">
                    <div className="buttons">
                        {createColors}
                    </div>   
                    {/* <input type="range" min="1" max="40" className="slider" value={brush} onChange={(event)=>setBrush(event.target.value)}/>  */}
                    <div className="brush-btn">
                        <button className="small-brush" onClick={()=>setBrush(3)}><span></span></button>
                        <button className="medium-brush" onClick={()=>setBrush(12)}><span></span></button>
                        <button className="large-brush" onClick={()=>setBrush(40)}><span></span></button>
                    </div>
                    <div className="high-buttons">
                        <button
                        className={'color-btn', 'super-btn'}
                        style={{backgroundColor:''}}
                            onClick={() => drawId.current.undo()
                            }
                        >
                        <img src={process.env.PUBLIC_URL + '/undo.png'} />
                        </button>
                        <button onClick={sendDrawing} className='btn'>Send</button>
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
                </div> :<p className="message-sent">Drawing Sent!<br />  Waiting for other players...</p>}
                

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
            {pauseGame ?
                <div className="pausegame">
                    <div>
                        <h2>Game Paused</h2>
                        <p>Someone left the game. Please wait until they join again, or someone replaces their spot!</p>
                    </div>
                </div> 
            : ""}
            

            </div> : <EndGame data={users} id={myId} />}
        </div>
        
    )
}
export default Game;