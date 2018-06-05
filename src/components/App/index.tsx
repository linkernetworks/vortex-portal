import * as React from 'react';
import './App.css';

import { Button } from 'antd';

import Hello from '../../containers/HelloContainer';
import logo from '../../assets/logo.svg';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Vortex</h1>
          <Button type="primary">Button</Button>
        </header>
        <Hello />
      </div>
    );
  }
}

export default App;
