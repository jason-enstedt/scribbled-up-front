import React from 'react';
import {Link} from 'react-router-dom';
const Home = () => (
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
                <p>Nirajan lorem ipsum zachary benji miscelaneaus info the cat went up to good library man hunter camel lorem ipsum zachary benji miscelaneaus info the cat went up to good library man hunter camellorem ipsum zachary benji miscelaneaus info the cat went up to good library man hunter camel</p>
            </div>
         
        </div>
    </div>
    
)
export default Home;