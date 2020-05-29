import React, {useState}from "react";

import CanvasDraw from "react-canvas-draw";


 const Draw = ()=>{
    const [color, setColor] = useState("black");
    const [brush, setBrush] = useState("10");
     return(
         <div>
        <CanvasDraw 
         ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
         hideGrid={true}
         brushColor={'#444'}
         
         />
         <button
            onClick={() => {
              this.saveableCanvas.undo();
            }}
          >
            Undo
          </button>
         </div>
         
     )
 }

 export default Draw;
