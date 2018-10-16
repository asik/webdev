import React, { Component } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Search from './Components/Search'
import './App.css';
import Recipe from './Components/Recipe';
import Axios from 'axios'

class App extends Component {


  onClick = () => {
    Axios.get("https://localhost:44349/api/values", {withCredentials: true}).then(something => {
      console.log(something);
    }).catch(reason => {
      console.log(reason.response);
      if (reason.response.statusCode === 401){
        console.log("401!!");
      }
    });
  }

  render() {
    return (
      <div>
        <header>
          <h1>Recipe galaxy</h1>
          <button>Sign in</button>
          <button type="button" onClick={() => this.onClick()}>Add a recipe</button>
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
