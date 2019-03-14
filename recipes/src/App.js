import './App.css';

import React, { Component } from 'react';
import {Route, Switch, Redirect, Link} from 'react-router-dom';

import Search from './Components/Search'
import {Recipe} from './Components/Recipe';
import AddRecipe from './Components/AddRecipe';
import Login from './Components/Login';
import PrivateRoute from './Components/PrivateRoute';
import * as Api from './Lib/Api';
import Register from './Components/Register';
 

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      authenticatedUser: ""
    }
  }
  registered = () => {
    console.log(this.props);
    console.log(this.props.history);
    this.props.history.push({
      pathname: '/login'
    });
  }
  isSignedIn = () => this.state.authenticatedUser !== "";
  signIn = username => this.setState({authenticatedUser: username});
  signOut = () => {
    Api.logout().then(() => {
      this.setState({authenticatedUser: ""});
    });
  };

  render() {

    const loginButtons = 
        <React.Fragment>
            {this.isSignedIn() 
                ? <li>
                    <p>{"Signed in as " + this.state.authenticatedUser}</p>
                    <button onClick={() => this.signOut()}>Sign out</button>
                  </li>
                :
                <React.Fragment>
                    <li>
                        <Link to="/login">Sign in</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>                
                </React.Fragment>
            }
        </React.Fragment>


    return (
      <div className="booya">
        <header>
          <h1>Recipe galaxy</h1>
            <div >
                <ul>
                    {loginButtons}
                    <li>
                        <Link to={"/addrecipe"}>Add Recipe</Link>
                    </li>
                </ul>
            </div>
        </header>  
        <main>
            <Switch>
            {this.isSignedIn()
                ? <Redirect from="/login" to="/"/>
                : []}
            <Redirect exact from="/" to="/search"/>
            <PrivateRoute path="/addrecipe" isAuthenticated={this.isSignedIn()} component={AddRecipe}/>
            <Route path="/login" render={() => <Login loggedInAs={this.signIn}/>}/>
            <Route path="/register" render={() => <Register registered={this.registered}/>}/>
            <Route path="/search" component={Search}/>
            <Route path="/recipe/:id" component={Recipe}/>          
            </Switch>
        </main>       
      </div>
    );
  }
}

export default App;
