/**
 * FIXME: notes tag relation fetch success but error when syncronize
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
  const [tagsViewData, setTagsViewData] = useState([]); // store active(interacable) tags
  const [selectedNote, setSelectedNote] = useState({}); // contain current selected note
  const [tagNamesLookup, setTagNamesLookup] = useState({}); // store tags for quick lookup by name
  const [selectedNotesTag, setSelectedNotesTag] = useState([]); // contain current selected notes tag
  const [selectedCategoryView, setSelectedCategoryView] = useState({}); // contain notes for selected category view for main content


  // imported context
  const { jwt, requestUpdateJwt } = useContext(authToken); // ambil jwt dari provider global

  useEffect(() => {
    if (jwt) {
      try {
        console.log(`Fetching data for category: ${activeCategory}`);
        let containerNote = {};
        let containerTags = {};

        const fetchData = async () => {

          // fetch all note info, return array of object key[index]: value
          await axios.get(`${import.meta.env.VITE_API_BASE_URL}/db/notes/get_all_notes_info`, {
            headers: {
              'Authorization': `Bearer ${jwt}`
            },
            withCredentials: true
          })
            .then(res => {
              containerNote = res.data.reduce((container, nextVal) => {
                if (!nextVal) return container; // Skip null or undefined entries
                container[nextVal.id] = nextVal;
                return container;
              }, {}); // mulai  dengan container kosong
            })
            .catch(err => {
              throw new Error("notes fetch error:", err);
            });

          // fetch all tags info, return array of object key[index]: value
          await axios.get(`${import.meta.env.VITE_API_BASE_URL}/db/tags/get_all_user_tags`, {
            headers: {
              'Authorization': `Bearer ${jwt}`
            },
            withCredentials: true
          })
            .then(res => res.data)
            .then(res => {
              containerTags = res.reduce((container, nextVal) => {
                if (!nextVal) return container;
                container[nextVal.id] = {
                  id: nextVal.id,
                  name: nextVal.name,
                  slug: nextVal.slug
                }
                return container;
              }, {})
            // Build tagNamesLookup for quick access
            const newTagNamesLookup = {};
            Object.values(containerTags).forEach(tag => {
              newTagNamesLookup[tag.name] = tag;
            });
            setTagNamesLookup(newTagNamesLookup);
            
            })
            .catch(err => {
              throw new Error("tags fetch error:", err);
            })
            .finally(() =>
              setTagsViewData(containerTags)
            );

          // fetch note relation with tags, return array of object {note_id, tag_id}
          await axios.get(`${import.meta.env.VITE_API_BASE_URL}/db/note_tags_relation/get_all_note_tags_relation`,
            {
              headers: {
                'Authorization': `Bearer ${jwt}`
              },
              withCredentials: true
            }
          )
            .then(res => res.data)
            .then(res => {
              // return ---> note_id : {}
              const formattedData = res.reduce((container, nextVal) => {
                container[nextVal.note_id] = {
                  ...container[nextVal.note_id],
                  [nextVal.tag_id]: containerTags[nextVal.tag_id].name
                };
                return container;
              }, {});
              containerNote = {
                ...Object.values(containerNote).reduce((container, nextVal) => {
                  container[nextVal.id] = {
                    ...nextVal, // check if the current note have tags
                    tags: formattedData[nextVal.id] || {} // TODO: feturn array of tags
                  };
                  return container;
                }, {})
              }
            })
            .catch(err => {
              throw new Error("tags fetch error:", err);
            })
            .finally(() => {
              setNoteViewData(containerNote);
            });

        };
        fetchData();
      } catch (err) {
        console.err(err);
        requestUpdateJwt();
      }
    }
  }, []); // 
  return (
    <>
      <sharedContext.Provider value={
        {
          notesViewData, setNoteViewData, 
          tagNamesLookup, setTagNamesLookup,
          tagsViewData, setTagsViewData,
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
