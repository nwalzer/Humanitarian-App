import './App.css';
import PersistentDrawerLeft from './components/NavBar'
import React from 'react';
import TableauViz from './components/TableauViz'

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <PersistentDrawerLeft /> 
          <br />
          <TableauViz />
        </header>
      </div>
    );
  }
}

export default App;



