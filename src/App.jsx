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
          <div className='flex overflow-auto h-full w-full'> {/* penyelesaiannya cuman gn, dah itu aja */}
            <Side_Panel />
            <div className='flex flex-1 flex-col'>
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
