import React, {useState, useEffect, useLayoutEffect, Redirect} from 'react';
import io from 'socket.io-client';
import CanvasDraw from "react-canvas-draw";

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

    
    useEffect(()=> {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const name = urlParams.get('name');
        const room = urlParams.get('room');
        

        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);
        socket.emit('join', {name, room}, () =>{
            
        });
       
        

        return () =>{
            socket.emit('disconnect');

            socket.off();
        }

    }, [ENDPOINT]);


    //update messages and users
    useEffect(()=>{
        socket.on('message', (message)=>{
            setMessages([message]);
            
            setIdMarker(message.user);
           // console.log(showDrawing);
            setReceivedDrawing('{"lines":[],"width":150,"height":752}');
            setShowDrawing(false);
            //console.log(message.user);
            setTime(60);
        })

        socket.on("roomData", ({users})=>{
            setUsers(users);

            
        })
    }, [messages, users]);


    useEffect(()=>{
        socket.on('isAdmin', (message)=>{
            setIsAdmin(message);
        });
       
        
        
    },[users]);
    window.addEventListener('touchmove', function (event) {
        event.preventDefault()
      }, {passive: false});
    useLayoutEffect(()=>{
        if(users){
            var myUser = users.find((user) => user.name === name);
            if(myUser == undefined){

            }else{
               // console.log(myUser.type);
                if(myUser.type == 'admin'){
                    setIsAdmin(true);
                }
            }
            
        }
    },[users])
    console.log(isAdmin);
    //send a phrase or guess to next user
    const sendMessage = () =>{
        //event.preventDefault();

        if(message){
            // if(idMarker === ''){
            //     var newId = idMarker;
            // }else{
            //     var newId = '';
            // }
            setDraw(true);
            setPhrase(false); 
            socket.emit('sendMessage', {message, idMarker}, () => setMessage(''));
            
        }
        
    }
    //send your drawing to next user
    const sendDrawing = () =>{
        
        if(drawing){
            
            socket.emit('sendDrawing', {drawing, idMarker}, () => setDrawing(''));
            setPhrase(true);
        }
    }
    //on drawing receive set the state for recevied drawing
    useEffect(()=>{
        socket.on('receiveDrawing', (message)=>{
            
            setReceivedDrawing(message.drawing);
            setIdMarker(message.id);
            setShowDrawing(true);
           // console.log(decompresseddrawing);
           setInitialMessage(false);
           setMessage('');
           setTime(15);
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
        socket.on('endGame', (gameend)=>{
            setGameEnd(gameend);
        })
    })
    //when game is started start the timer
    useEffect(()=>{
        socket.on('gameStart', (start)=>{
            
            setGame(start);
            setPhrase(true);
            setTime(10);
        })
    },[]);

    //timer starts, runs senddrawing or sendmessage depending on state
    useEffect(()=>{
        if(game){
            if(time !== 0){
                setTimeout(()=>{
                setTime(time - 1);
            },1000)}else{
                if(phrase){
                    sendMessage();
                    
                    
                }else{
                    
                    sendDrawing();
                    //setDraw(false);
                    
                }
                
            }
            
        }
    }, [time])
    
   
   
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
            <p className="code">Code:<span className="code-text">{room}</span> </p>
            {game ? <p className="countdown"><span>{time}</span>s</p> : ''}
            </div>
            {game ? '': 
            <div className="player-list">
                <h2>Players</h2>
                <ul>
                    {users.slice(0).map((user, index)=><li key={user.name}>{index + 1 + '. '}{user.name} {user.type == 'admin' ? `(${user.type})` : ''}</li>)}
                </ul>
                
            </div>}
           {showDrawing ? '' :<div className="messages">
                {messages.map((message, i)=> <p key={i}>{ message.text}</p>)}
            </div> }
            

            {phrase ? <div className="starting-phrase">
                <h2>{initialMessage ? 'Enter your starting phrase here...':"Enter your guess here..."}</h2>
                <input 
                placeholder="Phrase..."
                className="text-box"
                value={message} 
                onChange={(event) => setMessage(event.target.value)} 
                // onKeyPress={event=> event.key === 'Enter' ? sendMessage(event) : null}
                />
            </div> :''}
            {draw ? <div className="draw">
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
             '' : <div>
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
                <p>Phrase->Drawing->Phrase->Drawing->Phrase->Drawing->etc...</p>
            </div>
            }
            
            
            {game ? '':
            <div className="start-container">
                {isAdmin ? <button className="start-btn" onClick={startGame}>Start the Game</button> : <p>Waiting for the Admin to start game...</p>}
                
            </div>
            }
            
        </div>
        
    )
}
export default Game;