import Main_Header from './Main_Header.jsx';
import Side_Panel from './Side_Panel.jsx';
import Main_Content from './Main_Content.jsx';
import Navbar from './navbar.jsx';
function Notes_App() {


  return ( 
    <>
      <div className='flex flex-col h-screen bg-gray-50'>
        <Navbar />
        <div className='flex flex-1 overflow-auto'> {/* Hapus overflow-auto dari sini, overflow-auto mengaktifkan scrollbar untuk anaknya dengan cara memberi batasan tinggi maksimal, sortoff bilang kalo overflow jangan tambah tinggi, izinkan aktifkan scroll */}
          <Side_Panel />
          <div className='flex flex-col'>
            <Main_Header />
            {/* router based content (dependency: search, category, sort, view) */}
            <Main_Content />
          </div>
        </div>
      </div>
    </>
  )
}

export default Notes_App;
