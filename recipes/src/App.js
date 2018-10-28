import './App.css';

import React, { Component } from 'react';
import {Route, Switch, Redirect, Link} from 'react-router-dom';

import Search from './Components/Search'
import Recipe from './Components/Recipe';
import AddRecipe from './Components/AddRecipe';
import Login from './Components/Login';
import PrivateRoute from './Components/PrivateRoute';
import * as Api from './Lib/Api';
 

class App extends Component {

  constructor(){
    super();
    this.state = {
      authenticatedUser: ""
    }
  }

  isSignedIn = () => this.state.authenticatedUser !== "";
  signIn = username => this.setState({authenticatedUser: username});
  signOut = () => {
    Api.logout().then(() => {
      this.setState({authenticatedUser: ""});
    });
  };

  render() {
    return (
      <div>
        <header>
          <h1>Recipe galaxy</h1>
          {this.isSignedIn()
            ? (<button onClick={() => this.signOut()}>Sign out</button>)
            : (<Link to="/login">Sign in</Link>)}
          <Link to={"/addrecipe"}><p>Add Recipe</p></Link>
        </header>        
        <Switch>
          {this.isSignedIn()
            ? <Redirect from="/login" to="/"/>
            : []}
          <Redirect exact from="/" to="/search"/>
          <PrivateRoute path="/addrecipe" isAuthenticated={this.state.isAuthenticated} component={AddRecipe}/>
          <Route path="/login" render={() => <Login loggedInAs={this.signIn}/>}/>
          <Route path="/search" component={Search}/>
          <Route path="/recipe/:id" component={Recipe}/>          
        </Switch>
            
      </div>
    );
  }
}

export default App;
