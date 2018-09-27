import React, { Component } from 'react';
import './App.css';
import Search from './Components/Search';

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <h1>Recipe galaxy</h1>
          <button>Sign in</button>
          <button>Add a recipe</button>
        </header>
        <Search/>
        
      </div>
    );
  }
}

export default App;
