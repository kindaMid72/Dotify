/**
 * FIXME: useEffect, something wrong with it
 */
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

// pages

import Main_Content from './Main_Content.jsx';
import Main_Header from './Main_Header.jsx';
import Navbar from './navbar.jsx';
import Side_Panel from './Side_Panel.jsx';

// components
import { authToken } from '../router.jsx';
import Edit_Note_Card from './components/Edit_Note_Card.jsx';

// shared context, containt shared data and states
export const sharedContext = createContext();

function Notes_App() {

  // state
  const [activeNote, setActiveNote] = useState(null); // Id Note yang sedang diedit, null jika tidak ada
  const [activeCategory, setActiveCategory] = useState('all'); // Kategori default: 'all', 'favorite', 'archived', dll.
  const [activeView, setActiveView] = useState('grid'); // Tampilan default: 'grid' atau 'list'
  const [activeSort, setActiveSort] = useState('date_desc'); // Pengurutan default: 'date_desc', 'date_asc', 'title_asc', dll.

  // data state storage, all data from server will be stored here
  const [notesViewData, setNoteViewData] = useState({}); // store all notes info data as an object
  const [tags, setTags] = useState([]); // store active(interacable) tags
  const [selectedNote, setSelectedNote] = useState({}); // contain current selected note
  const [selectedNotesTag, setSelectedNotesTag] = useState([]); // contain current selected notes tag
  const [selectedCategoryView, setSelectedCategoryView] = useState({}); // contain notes for selected category view for main content


  // imported context
  const { jwt } = useContext(authToken); // ambil jwt dari provider global

  useEffect(() => {

    if (jwt) {
      console.log(`Fetching data for category: ${activeCategory}`);
      // TODO: Implement data fetching logic here based on activeCategory
      const fetchData = async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/db/notes/get_all_notes_info`, {
          headers: {
            'Authorization': `Bearer ${jwt}`
          },
          withCredentials: true
        }
        );
        const notesObject = response.data.reduce((container, nextVal) => {
          if (!nextVal) return container; // Skip null or undefined entries
          container[nextVal.id] = nextVal;
          return container;
        }, {}); // mulai  dengan container kosong
        setNoteViewData(notesObject);
      };
      fetchData();
    }
  }, []); // 
  return (
    <>
      <sharedContext.Provider value={
        {
          notesViewData, setNoteViewData,
          tags, setTags,
          selectedNote, setSelectedNote,
          selectedNotesTag, setSelectedNotesTag,
          activeNote, setActiveNote,
          activeCategory, setActiveCategory,
          activeView, setActiveView,
          activeSort, setActiveSort,
          selectedCategoryView, setSelectedCategoryView
        }
      }>
        <div className='flex flex-col h-screen bg-gray-50'>
          <Navbar />
          <div className='flex flex-1 overflow-auto'> {/* Hapus overflow-auto dari sini, overflow-auto mengaktifkan scrollbar untuk anaknya dengan cara memberi batasan tinggi maksimal, sortoff bilang kalo overflow jangan tambah tinggi, izinkan aktifkan scroll */}
            <Side_Panel />
            <div className='flex flex-col w-full'>
              {
                activeNote ?
                  <Edit_Note_Card />
                  :
                  <div className='flex flex-col w-full h-full overflow-auto'>
                    <Main_Header />
                    <Main_Content />
                  </div>
              }
              {/* router based content (dependency: search, category, sort, view) */}

            </div>
          </div>
        </div>
      </sharedContext.Provider>
    </>
  )
}

export default Notes_App;
