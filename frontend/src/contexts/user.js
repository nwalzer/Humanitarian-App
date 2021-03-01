import React from 'react'

const userContext = React.createContext({userState: false, toggleState: () => {this.userState = !this.userState}}); 
  
export default userContext;
