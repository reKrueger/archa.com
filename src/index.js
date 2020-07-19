import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

// React Router
// ========================================


function App() {
  
  
  return (
    <div>
      <Switch>
        <Route exact path={"/"}>
          <Home/>
        </Route>
      </Switch>
    </div>
  );
}






ReactDOM.render(
  <React.Fragment>
    <Router>
      <App/>
    </Router>
  </React.Fragment>,
  document.getElementById('root')
);

