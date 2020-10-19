import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.scss';
import Home from './components/home';
import Create from './components/create';
import Join from './components/join';
import Game from './components/game';
import Top from './components/top';
import Draw from './components/draw';
import background from '../src/images/social-media-doodle-seamless-pattern-social-media-doodle-seamless-pattern-repeated-ornament-hand-drawn-elements-white-162559147.jpg';
function App() {
  var sectionStyle = {
      backgroundImage: "url("+ background + ")",
  };
  
  
    
  
    
  
  
  
  return (
    <div className="App" id ="App" style={sectionStyle}>
    <div className="stacker">
      <Router>

        <Top />

        <Switch>

          <Route path="/" exact >
            <Home />
          </Route>

          <Route path="/create" exact>
            <Create />
          </Route>

          <Route path="/join" exact>
            <Join />
          </Route>

          <Route path="/game" exact>
            <Game />
          </Route>

          <Route path="/draw" exact>
            <Draw />
          </Route>

          <Route >
            <Home />
          </Route>

        </Switch>
          
      </Router>
    </div>
     
      
   </div>
  );
  
}

export default App;
