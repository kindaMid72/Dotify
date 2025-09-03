import { useState, StrictMode } from 'react';
import Navbar from './navbar.jsx';
import { BrowserRouter } from 'react-router-dom';
import Side_Panel from './Side_Panel.jsx';
import Main_Header from './Main_Header.jsx';
function App() {

  return (
    <>
    <StrictMode>
      <BrowserRouter>
        <div className='flex flex-col h-screen'>
          <Navbar/>
          <div className='flex flex-1'>
            <Side_Panel/>
            <div className='w-full flex flex-col'>
              <Main_Header/>
              {/* router based content (dependency: search, category, sort, view) */}
              
            </div>
          </div>
        </div>


      </BrowserRouter>
    </StrictMode>
    </>
  )
}

export default App;
