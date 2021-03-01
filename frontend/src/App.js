import './App.css';
import PersistentDrawerLeft from './components/NavBar'
import React from 'react';
import userContext from './contexts/user'

class App extends React.Component {

  constructor(props) {
    super(props); 

    // this.toggleState = () => {this.setState(state => ({userState: !state.userState}));}
    this.state = {
      userState: false
    }
  } 
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <userContext.Provider>
          <PersistentDrawerLeft /> 
          </userContext.Provider>
          <br />
        </header>
      </div>
    );
  }
}

export default App;



