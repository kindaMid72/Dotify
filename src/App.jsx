import { useState, StrictMode } from 'react';
import Navbar from './navbar.jsx';
import { BrowserRouter } from 'react-router-dom';
import Side_Panel from './Side_Panel.jsx';
import Main_Page from './Main_Page.jsx';
function App() {

  return (
    <>
    <StrictMode>
      <BrowserRouter>
        <div className='flex flex-col h-screen'>
          <Navbar/>
          <div className='flex flex-1'>
            <Side_Panel/>
            <Main_Page/>
          </div>
        </div>


      </BrowserRouter>
    </StrictMode>
    </>
  )
}

export default App;
