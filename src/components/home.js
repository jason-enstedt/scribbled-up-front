import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
const Home = () => {
    useEffect(()=> {
        var element = document.getElementById("App");
        element.classList.remove("invert");
      }, []);
 return (
    <div id="home">
        <div className="home-btns">
        <Link to="/create" className="btn">Create</Link>
        <Link to="/join" className="btn">Join</Link>
        <Link to="/draw" className="btn">Draw</Link>
        </div>
        <div className="home-info">
            <div className="blurry"></div>
            <div className="foreground">
                <h2>What's Scribbled Up?</h2>
                <p>Scribbled up is based off the popular game Telestrations. It combines the classic game of Telephone with Pictionary! You start the game by thinking of a phrase for someone to draw! Each round you will receive either someone else's drawing that you need to guess what it is, or a guess which you will need to draw! Get a group of friends and start a game! </p>
            </div>
         
        </div>
    </div>
    
)   
}
export default Home;