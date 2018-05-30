import * as React from 'react';
import './App.css';

import Hello from '../../containers/HelloContainer';
import logo from '../../assets/logo.svg';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Vortex</h1>
        </header>
        <Hello />
      </div>
    );
  }
}

export default App;
