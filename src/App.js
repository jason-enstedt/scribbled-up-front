import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Create from './components/create';
import Join from './components/join';
import Game from './components/game';
import Top from './components/top';
import Draw from './components/draw';
function App() {
  return (
    <div className="App">
     
      <Router><Top />
          <Route path="/" exact >
            <Home />
          </Route>
          <Route path="/create">
            <Create />
          </Route>
          <Route path="/join">
            <Join />
          </Route>
          <Route path="/game">
            <Game />
          </Route>
          <Route path="/draw">
            <Draw />
          </Route>
      </Router>
   </div>
  );
}

export default App;
