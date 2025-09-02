import { useState, StrictMode } from 'react';
import Navbar from './navbar.jsx';
import { BrowserRouter } from 'react-router-dom';
function App() {

  return (
    <>
    <StrictMode>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </StrictMode>
    </>
  )
}

export default App;
