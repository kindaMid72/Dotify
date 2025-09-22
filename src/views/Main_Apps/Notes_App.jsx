import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// pages

import Main_Content from './Main_Content.jsx';
import Main_Header from './Main_Header.jsx';
import Navbar from './navbar.jsx';
import Side_Panel from './Side_Panel.jsx';

// components
import { AppContext } from '../router.jsx';
import Edit_Note_Card from './components/Edit_Note_Card.jsx';

function Notes_App() {

  // state
  const [activeNote, setActiveNote] = useState(null); // Note yang sedang diedit, null jika tidak ada
  const [activeCategory, setActiveCategory] = useState('all'); // Kategori default: 'all', 'favorite', 'archived', dll.
  const [activeView, setActiveView] = useState('grid'); // Tampilan default: 'grid' atau 'list'
  const [activeSort, setActiveSort] = useState('date_desc'); // Pengurutan default: 'date_desc', 'date_asc', 'title_asc', dll.

  // data state storage, all data from server will be stored here
  const [notes, setNotes] = useState([]); // store active(interacable) notes
  const [tags, setTags] = useState([]); // store active(interacable) tags
  const [selectedNote, setSelectedNote] = useState(null); // contain current selected note
  const [selectedNotesTag, setSelectedNotesTag] = useState([]); // contain current selected notes tag

  // credentials
  const { jwt } = useContext(AppContext); // ambil jwt dari provider global

  useEffect(() => {

    if (jwt) {
      console.log(`Fetching data for category: ${activeCategory}`);
      // TODO: Implement data fetching logic here based on activeCategory

      if (activeCategory === 'all') {
        const data = axios.get()
      } else if (activeCategory === 'favorite') {
        // fetch favorite notes
      } else if (activeCategory === 'archived') {
        // fetch archived notes
      } else { // trash category
        // fetch trash notes
      }

    }
  }, [jwt, activeCategory]); // Jalankan effect ini jika jwt atau activeCategory berubah

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
          <div className='flex flex-col w-full'>
            {
              activeNote ?
                <Edit_Note_Card activeNote={activeNote} setActiveNote={setActiveNote} />
                :
                <>
                  <Main_Header
                    activeView={activeView}
                    setActiveView={setActiveView}
                    activeSort={activeSort}
                    setActiveSort={setActiveSort}
                  />
                  <Main_Content
                    activeNote={activeNote} // for edit note & new note edit
                    setActiveNote={setActiveNote} // for new note & edit note
                    activeCategory={activeCategory} // all, favorite, archived, dll.
                    setActiveCategory={setActiveCategory}
                    activeView={activeView} // grid or list
                    activeSort={activeSort} // date_desc, date_asc, title_asc, dll.
                  />
                </>
            }
            {/* router based content (dependency: search, category, sort, view) */}

          </div>
        </div>
      </div>
    </>
  )
}

export default Notes_App;
