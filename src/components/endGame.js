import React from 'react';
import CanvasDraw from "react-canvas-draw";

const EndGame = (props) => {
 console.log(props);

 const resultMaker = () =>{
   console.log(props.data[0])
   let user = props.data.map((value, index)=>{
       if((index + 1)%2 === 0){
           return(
           <p>{value.game.length} even</p>
           )
       }else{
           return(
              <p>{value.game.length} odd </p> 
           )
            
       }
       
   });
        return(
           <div>
               {user}
           </div>
        )
 }
 const resultMaker2 = () =>{
    console.log(props.data[0])
    let users = props.data.map((value, index)=>{
        let user = value.game.map((val, index)=>{
            if((index + 1)%2 === 0){
                return(
                <CanvasDraw 
                    className="canvasDraw"
                    hideGrid={true}
                    
                    lazyRadius={0}
                    canvasWidth={window.innerWidth}
                    canvasHeight={window.innerHeight - 350}
                    
                    hideInterface={true}
                    saveData={val}
                    disabled={true}
                    />
                )
            }else{
                return(
                    <p>{val}</p>
                )
                 
            }
        })

        return(
            <div>
                <h2>{value.name}</h2>
                {user}
            </div>
        )
        
    });
         return(
            <div>
                {users}
            </div>
         )
  }
    
return(

    <div className="endgame">
       <p>end game{}</p>
       <div>
           {resultMaker2()}
       </div>
    </div>
)}
export default EndGame;