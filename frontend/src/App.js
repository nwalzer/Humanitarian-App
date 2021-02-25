import './App.css';
import PersistentDrawerLeft from './components/NavBar'
import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PersistentDrawerLeft /> 
        <br />
      </header>
    </div>
  );
}

export default App;
