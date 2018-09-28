import React, { Component } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Search from './Components/Search'
import './App.css';
import Recipe from './Components/Recipe';

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <h1>Recipe galaxy</h1>
          <button>Sign in</button>
          <button>Add a recipe</button>
        </header>
        <Switch>
          <Redirect exact from="/" to="/search"/>
          <Route path="/search" component={Search}/>
          <Route path="/recipe/:id" component={Recipe}/>
        </Switch>
      </div>
    );
  }
}

export default App;
