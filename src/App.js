import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
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
  );
}

export default App;
