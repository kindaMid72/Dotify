import { useState } from 'react';

import Main_Content from './Main_Content.jsx';
import Main_Header from './Main_Header.jsx';
import Navbar from './navbar.jsx';
import Side_Panel from './Side_Panel.jsx';

// components
import Edit_Note_Card from './components/Edit_Note_Card.jsx';

function Notes_App() {
  const [activeNote, setActiveNote] = useState(null); // Note yang sedang diedit, null jika tidak ada
  const [activeCategory, setActiveCategory] = useState('all'); // Kategori default: 'all', 'favorite', 'archived', dll.
  const [activeView, setActiveView] = useState('grid'); // Tampilan default: 'grid' atau 'list'
  const [activeSort, setActiveSort] = useState('date_desc'); // Pengurutan default: 'date_desc', 'date_asc', 'title_asc', dll.

  const [selectedActiveNote, setSelectedActiveNote] = useState(null); // contain current selected note

  // fetching data

  return (
    <>
      <div className='flex flex-col h-screen bg-gray-50'>
        <Navbar />
        <div className='flex flex-1 overflow-auto'> {/* Hapus overflow-auto dari sini, overflow-auto mengaktifkan scrollbar untuk anaknya dengan cara memberi batasan tinggi maksimal, sortoff bilang kalo overflow jangan tambah tinggi, izinkan aktifkan scroll */}
          <Side_Panel
            activeNote={activeNote} // for new note
            setActiveNote={setActiveNote}
            activeCategory={activeCategory} // for category, highlight current active category
            setActiveCategory={setActiveCategory} 
          />
          <div className='flex flex-col'>
            <Main_Header 
              activeView={activeView}
              setActiveView={setActiveView}
              activeSort={activeSort}
              setActiveSort={setActiveSort}
            />
            {activeNote && <Edit_Note_Card />}
            {/* router based content (dependency: search, category, sort, view) */}
            <Main_Content 
              activeNote={activeNote} // for edit note & new note edit
              setActiveNote={setActiveNote} // for new note & edit note
              activeCategory={activeCategory} // all, favorite, archived, dll.
              setActiveCategory={setActiveCategory}
              activeView={activeView} // grid or list
              activeSort={activeSort} // date_desc, date_asc, title_asc, dll.
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Notes_App;
