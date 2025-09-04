import { BrowserRouter } from 'react-router-dom';
import Main_Content from './Main_Content.jsx';
import Main_Header from './Main_Header.jsx';
import Navbar from './navbar.jsx';
import Side_Panel from './Side_Panel.jsx';
function App() {

  return (
    <>
      <BrowserRouter>
        <div className='flex flex-col h-screen bg-gray-50'>
          <Navbar />
          <div className='flex h-full overflow-auto'>
            <Side_Panel />
            <div className='flex flex-col overflow-hidden'>
              <Main_Header />
              {/* router based content (dependency: search, category, sort, view) */}
              <Main_Content />
            </div>
          </div>
        </div>


      </BrowserRouter>
    </>
  )
}

export default App;
