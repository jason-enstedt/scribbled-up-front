import React from 'react';
import {Link} from 'react-router-dom';
const Home = () => (
    <div className="home-btns">
        
       <Link to="/create" className="btn">Create</Link>
       <Link to="/join" className="btn">Join</Link>
       <Link to="/draw" className="btn">Draw</Link>
    </div>
)
export default Home;