/**
 * 
 * 
 * 
 */

import axios from 'axios';
import { useContext, useState } from "react";
import { authToken } from '../router.jsx';
import { sharedContext } from "./Notes_App";


function Side_Panel() {

    // shared context
    const { jwt, setJwt, requestUpdateJwt } = useContext(authToken);
    const {
        activeCategory, setActiveCategory,
        tagsViewData, setTagsViewData,
        activeNote, setActiveNote,
        notesViewData, setNoteViewData,
        selectedNote, setSelectedNote,
        tagNamesLookup, setTagNamesLookup
    } = useContext(sharedContext);


    // state
    const [focusTags, setFocusTags] = useState('hidden');

    // handler
    function category(type) { // all, favorite, archive, ect
        setActiveCategory(type);
    }
    function setActiveClass(type) {
        return type === activeCategory ?
            "hover:rounded-md hover:p-1 origin-left w-full bg-blue-200 border-2 !border-blue-300 flex items-center max-w-full dark:bg-blue-900 dark:!border-blue-700 dark:text-white"
            :
            "hover:bg-gray-300 hover:rounded-md hover:p-1 origin-left w-full flex items-center max-w-full dark:hover:bg-gray-700";
    }
    async function handleAddNewNote() {
        // fetch: request add new note
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/db/notes/create_note`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    },
                    withCredentials: true,
                }
            ).then(res => res.data);
            setActiveNote(response.noteId);
            setNoteViewData(prevNoteViewData => {
                return { // add new note to noteViewData, update the main content views
                    ...prevNoteViewData,
                    [response.noteId]: {
                        id: response.noteId,
                        title: "",
                        is_favorite: 0,
                        is_archive: 0,
                        is_trash: 0,
                        tags: {},
                        created_at: Date.now(),
                        updated_at: Date.now()
                    }
                }
            });
            setSelectedNote({
                noteId: response.noteId,
                title: "",
                isFavorite: false,
                isArchive: false,
                tags: {},
                content: "",
                createdAt: Date.now(),
                updatedAt: Date.now()
            })
        } catch (err) {
            setJwt(''); // trigger jwt refresh
            console.error(err);
        }
    }
    async function deleteTag(e, tagId) {
        e.preventDefault();
        e.stopPropagation();
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/db/tags/delete_tag`,
            {
                data: {
                    tagId: tagId
                },
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
                withCredentials: true
            }
        )
            .then(res => {
                // update global tags view state
                setTagsViewData(prev => {
                    const { [tagId]: deletedTag, ...rest } = prev; // take all prev value but exclude the deleted tag
                    // Also update tagNamesLookup
                    if (deletedTag) {
                        setTagNamesLookup(prevLookup => {
                            const { [deletedTag.name]: deleted, ...restLookup } = prevLookup;
                            return restLookup;
                        });
                    }
                    return rest;
                });

                setNoteViewData(prevNoteViewData => {
                    const newNoteViewData = { ...prevNoteViewData };
                    for (const noteId in newNoteViewData) {
                        // Check if the note has the tag to be deleted
                        if (newNoteViewData[noteId].tags && newNoteViewData[noteId].tags[tagId]) {
                            // Create a new tags object without the deleted tag
                            const { [tagId]: deletedTag, ...restTags } = newNoteViewData[noteId].tags;
                            // Update the note with the new tags object
                            newNoteViewData[noteId] = { ...newNoteViewData[noteId], tags: restTags };
                        }
                    }
                    return newNoteViewData;
                });
            })
            .catch(err => {
                requestUpdateJwt();
                console.error(err);
            })
    }

    return (
        <div className=' absolute h-full overflow-hidden md:relative md:h-full z-50 no-scrollbar p-3 w-[250px] flex flex-col items-center border-gray-300 border-r-2 pl-6 [&_*]:mb-1 [&_*]:font-mono [&_*]:font-extrabold [&_*]:cursor-pointer bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 [&_li]:p-1 [&_li]:rounded-md [&_li]:border-2 [&_li]:border-transparent [&_li]:transition-color [&_li]:ease-in [&_li]:duration-200 '>
            <button onClick={() => handleAddNewNote()} className='border-2 w-full border-transparent rounded-md px-2 py-1 bg-blue-600 text-white font-mono font-[900] !mb-5 hover:bg-blue-700 transition-colors ease-in duration-200 dark:bg-blue-700 dark:hover:bg-blue-600'>+ New Note</button>
            <ol className='no-scrollbar flex flex-col justify-start w-[200px] items-start gap-2 [&_i]:mr-2 overflow-auto'>
                <li onClick={() => category('all')} className={setActiveClass('all')}><i className="fa-solid fa-clipboard "></i>All Notes</li>
                <li onClick={() => category('favorite')} className={setActiveClass('favorite')}><i className="fa-solid fa-star "></i>Favorite</li>
                <li onClick={() => focusTags === 'hidden' ? setFocusTags('block') : setFocusTags('hidden')} className={setActiveClass('')}><i className="fa-solid fa-tags"></i>Tags</li>
                <li className={`${focusTags} w-full !pl-3 flex dark:text-gray-300`}>
                    <div className="border-x-1 border-black mr-2"></div>
                    <ol className="flex flex-1 flex-col overflow-hidden [&_li]:overflow-hidden [&_li]:whitespace-nowrap [&_li]:text-ellipsis">
                        {Object.values(tagsViewData).map((tag) => {
                            return (                        //   chante the active category to the current active tags
                                <li key={tag.slug} className={setActiveClass(tag.id)} onClick={() => setActiveCategory(tag.id)}>
                                    <p className='flex-1 overflow-hidden whitespace-nowrap text-ellipsis text-sm'>{tag.name}</p>
                                    <i className='fa-solid fa-xmark cursor-pointer transition-colors ease-in-out duration-75 hover:text-red-500 dark:hover:text-red-400' onClick={(e) => { deleteTag(e, tag.id); }}></i>
                                </li>
                            )
                        })}
                    </ol>
                </li>
                <li onClick={() => category('archive')} className={setActiveClass('archive')}><i className="fa-solid fa-box-archive"></i>Archived</li>
                <li onClick={() => category('trash')} className={setActiveClass('trash')}><i className="fa-solid fa-trash"></i>Trash</li>
            </ol>
        </div>
    )
}

export default Side_Panel;