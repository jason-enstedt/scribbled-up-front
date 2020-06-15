import React, {useState} from 'react';
import CanvasDraw from "react-canvas-draw";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from 'react-responsive-carousel';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EndGame = (props) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const buttonMaker = props.data.map((user, index)=>(<button className="btn" onClick={()=>{showMe(index)}}>{user.name}</button>))
       
    const showMe = (index)=>{
        setCurrentSlide(index);
    }
 const resultMaker2 = (index) =>{
    console.log(props.data[0])

    let users = props.data[index].game.map((val, index)=>{
        
        
            if((index + 1)%2 === 0){
                return(
                    <div className="slider-slide">
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
                    </div>
                )
            }else{
                if(index === 0){
                    return (
                        <div className="slider-slide">
                        <p>Starting Phrase was...<br />{val}</p>
                    </div>
                    )
                }else{
                    return(
                    <div className="slider-slide">
                        <p>{val}</p>
                    </div>
                )
                }
                
                 
            }

        
    });
         return(
            <Slider className={index +1}>
                {users}
            </Slider> 
         )
  }
    
return(

    <div className="endgame">
       
       <div>
           {resultMaker2(currentSlide)}
       </div>
       <div className="end-btn">
           {buttonMaker}
       </div>
    </div>
)}
export default EndGame;