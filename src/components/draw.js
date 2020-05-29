import React, {useState}from "react";

import CanvasDraw from "react-canvas-draw";


 const Draw = ()=>{
    const [color, setColor] = useState("#444");
    const [brush, setBrush] = useState(10);
    const [saved, setSaved] = useState('');
    const drawId = React.createRef();
    const colors = [
        "black","white","blue", "orange", "yellow", "green", "red", "purple", "brown"
    ]
    
    const createColors = colors.map((color)=>(<button key={color} onClick={()=> changeColor(color)} style={{backgroundColor:color}} className={'color-btn'}>
    </button>))
    const changeColor = (color) =>{
        setColor(color);
    }
    const save = (event) =>{
        event.preventDefault();
        setSaved(drawId.current.getSaveData());
        console.log(drawId.current.getSaveData());
    }
    
     return(
         <div className="draw">
            <CanvasDraw 
            className="canvasDraw"
            ref={drawId}
            hideGrid={true}
            brushColor={color}
            lazyRadius={0}
            canvasWidth={window.innerWidth}
            canvasHeight={window.innerHeight - 175}
            brushRadius={brush}
            hideInterface={true}
            saveData={saved ? saved : null}
            />
            
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
        <button onClick={save}>save</button>
        </div>
         
     )
 }

 export default Draw;
