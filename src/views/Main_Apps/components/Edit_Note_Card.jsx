/**
 * FIXME: tag double after close the edit page, occur frequently
 *        figure out what trigger this bug,
 *        this trigger because the button pressed2 times
 * 
 * 
 */

import axios from 'axios';
import { useContext, useEffect, useState } from "react";
import { sharedContext } from "../Notes_App.jsx";

// shared context
import { authToken } from "../../router.jsx";

export default function () {
    //shared context
    const {
        activeNote, setActiveNote,
        selectedNote, setSelectedNote,
        noteViewData, setNoteViewData,
        tagsViewData, setTagsViewData,
        tagNamesLookup, setTagNamesLookup // Ambil tagNamesLookup dari context
    } = useContext(sharedContext);
    const { jwt, requestUpdateJwt } = useContext(authToken);

    const date = new Date(selectedNote.createdAt);

    // state
    const [tags, setTags] = useState([]); // active tags
    const [newTag, setNewTag] = useState(false);
    const [newTagValue, setNewTagValue] = useState("");
    const [showEditMetadata, setShowEditMetadata] = useState(false);

    //custom hooks
    function useDebounce(value, delay) {
        const [debouncevalue, setDebounceValue] = useState(value); // copy value dari parameters
        useEffect(() => {
            const handler = setTimeout(() => {
                setDebounceValue(value);
            }, delay);
            return () => { // cleanup function, if new value accurred, clear timeout
                clearTimeout(handler);
            }
        }, [value, delay]);
        return debouncevalue;
    }

    // handler
    function handleSubmit(e) {
        e.preventDefault();
    }

    // metadata debouncer
    const debounceMetadata = useDebounce({
        noteId: selectedNote.noteId,
        title: selectedNote.title,
        isFavorite: selectedNote.isFavorite,
        isArchive: selectedNote.isArchive,
        isTrash: selectedNote.isTrash,
        createdAt: selectedNote.createdAt,
        updatedAt: selectedNote.updatedAt
        // TODO: add tags dependency here
    }, 1000);
    useEffect(() => { // use effect for metadata update
        if (!debounceMetadata.noteId) {
            return;
        }
        const updateNote = async () => {
            try {
                // Gunakan await untuk menunggu respons dari server
                const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/db/notes/edit_note_metadata`,
                    {
                        noteId: debounceMetadata.noteId,
                        title: debounceMetadata.title || "untitled",
                        isFavorite: debounceMetadata.isFavorite,
                        isArchive: debounceMetadata.isArchive,
                        isTrash: debounceMetadata.isTrash
                    },
                    {
                        headers: { 'Authorization': `Bearer ${jwt}` },
                        withCredentials: true
                    }
                );
                // if(response.status <= 300){
                //     console.log("Note metadata updated successfully:", response.data);
                // }
            } catch (err) {
                await requestUpdateJwt();
                console.error("Failed to update note:", err.response?.data || err.message);
            } finally {
                // Konversi boolean ke angka sebelum update state
                setNoteViewData(prevNoteViewData => ({
                    ...prevNoteViewData,
                    [debounceMetadata.noteId]: {
                        ...prevNoteViewData[debounceMetadata.noteId],
                        id: debounceMetadata.noteId,
                        title: debounceMetadata.title || "untitled",
                        is_favorite: debounceMetadata.isFavorite ? 1 : 0,
                        is_archive: debounceMetadata.isArchive ? 1 : 0,
                        is_trash: debounceMetadata.isTrash ? 1 : 0,
                        updated_at: Date.now()
                    }
                }));
            }
        }
        updateNote();
    }, [debounceMetadata, jwt])

    // content debouncer
    const debouncedContent = useDebounce(selectedNote.content, 1500);
    useEffect(() => {
        if (!debouncedContent) { // onpage load, selectNote is still undefine
            return; // then if this code will prevent unintended api calls updater
        }
        const updateNote = async () => {
            try {
                const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/db/notes/edit_content`,
                    { // body request
                        noteId: selectedNote.noteId,
                        content: selectedNote.content
                    },
                    { // headers
                        headers: {
                            'Authorization': `Bearer ${jwt}`
                        },
                        withCredentials: true
                    }
                );

                // if (response.status <= 399) {
                //     console.log("Note content updated successfully:", response.data);
                // } else {
                //     console.log(response.data);
                // }
            } catch (err) {
                await requestUpdateJwt();
                console.error("Failed to update note content:", err.response?.data || err.message);
            } finally {
                setSelectedNote((pref) => {
                    return (
                        {
                            ...pref,
                            content: selectedNote.content,
                            updatedAt: Date.now()
                        }
                    )
                })
            }
        }
        updateNote();
    }, [debouncedContent, jwt]);

    // handler function
    function editMetadata(e) {
        e.preventDefault();
        setShowEditMetadata(!showEditMetadata);
    }
    async function handleDeleteNoteTags(e, deletedTagId) {
        e.preventDefault();
        e.stopPropagation();
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/db/note_tags_relation/delete_note_tags_relation`,
                {
                    data: {
                        noteId: selectedNote.noteId,
                        tagId: deletedTagId
                    },
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${jwt}`
                    },
                    withCredentials: true
                })
                .then(res => {
                    if (res.status <= 300) {
                        // update the global state if the deletion si success
                        setSelectedNote(prev => {
                            return {
                                ...prev,
                                tags: Object.entries(prev.tags).reduce((container, [id, name]) => {
                                    if (id !== deletedTagId) {
                                        container[id] = name;
                                    }
                                    return container;
                                }, {})
                            }
                        })
                        setNoteViewData(prevNoteViewData => {
                            return {
                                ...prevNoteViewData,
                                [selectedNote.noteId]: {
                                    ...prevNoteViewData[selectedNote.noteId],
                                    tags: Object.entries(prevNoteViewData[selectedNote.noteId].tags).reduce((container, [id, name]) => {
                                        if (id !== deletedTagId) {
                                            container[id] = name;
                                        }
                                        return container;
                                    }, {})
                                }
                            }
                        })
                    }
                })
                .catch(err => {
                    requestUpdateJwt();
                    console.error(err);
                })

        } catch (err) {
            requestUpdateJwt();
            console.error(err);
        }
    }
    async function handleAddNewNoteTags(e) {
        e.preventDefault();
        e.stopPropagation();

    }
    async function handleSaveClosedNote() {
        const content = selectedNote.content;
        const title = selectedNote.title;
        const noteId = selectedNote.noteId;
        const isFavorite = selectedNote.isFavorite;
        const isArchive = selectedNote.isArchive;
        const isTrash = selectedNote.isTrash;
        // TODO: add tags
        const createdAt = selectedNote.createdAt;
        const updatedAt = Date.now();

        // update all content to server
        try {
            await Promise.all([
                axios.put(`${import.meta.env.VITE_API_BASE_URL}/db/notes/edit_content`,
                    { // body request
                        noteId: noteId,
                        content: content
                    },
                    { // headers
                        headers: { 'Authorization': `Bearer ${jwt || "expired token"}` },
                        withCredentials: true
                    }),
                axios.put(`${import.meta.env.VITE_API_BASE_URL}/db/notes/edit_note_metadata`,
                    {
                        noteId: noteId,
                        title: title,
                        isFavorite: isFavorite,
                        isArchive: isArchive,
                        isTrash: isTrash,
                        // TODO: add tags update
                    },
                    {
                        headers: { 'Authorization': `Bearer ${jwt || "expired token"}` },
                        withCredentials: true
                    }
                )
            ])
        } catch (err) {
            await requestUpdateJwt();
            console.error("Failed to save note on close:", err);
        } finally {
            // Konversi boolean ke angka sebelum update state
            setNoteViewData(prevNoteViewData => {
                return {
                    ...prevNoteViewData,
                    [noteId]: {
                        ...prevNoteViewData[noteId],
                        id: noteId,
                        title: title || "untitled",
                        is_favorite: isFavorite ? 1 : 0,
                        is_archive: isArchive ? 1 : 0,
                        is_trash: isTrash ? 1 : 0,
                        updated_at: Date.now()
                    }
                }
            })
            setShowEditMetadata(false);
            setActiveNote(null);
            setSelectedNote({});
        }
    }
    async function createNewNoteTags() {
        //  if (exist) create note_tag relation with existing tags
        // if(!exist) create new tags, save it to local state & db, create note_tag relation with new tags

        // check if the new tag value is already exist (by name) via tagsNameLookup
        const newVal = newTagValue;
        const newTagLowercase = newVal.trim(); // only filter the extra spaces, this section is case sensitive
        if(newTagLowercase.length === 0){
            setNewTagValue('');
            return;
        }
        const isExist = tagNamesLookup[newTagLowercase]; // O(1) complexity, return valid tags data
        setNewTagValue('');
        if (isExist) {
            // create note tag relation with existing tags
            const existedTagId = isExist.id;
            console.log(existedTagId);
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/db/note_tags_relation/create_note_tags_relation`,
                {
                    noteId: selectedNote.noteId,
                    tagId: existedTagId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    },
                    withCredentials: true
                }
            )
                .then(res => {
                    // update local state
                    setSelectedNote(prev => {
                        return {
                            ...prev,
                            tags: {
                                ...prev.tags,
                                [existedTagId]: isExist.name
                            }
                        }
                    })
                    // update global state
                    setNoteViewData(prevNoteViewData => {
                        return {
                            ...prevNoteViewData,
                            [selectedNote.noteId]: {
                                ...prevNoteViewData[selectedNote.noteId],
                                tags: {
                                    ...prevNoteViewData[selectedNote.noteId].tags,
                                    [existedTagId]: isExist.name
                                }
                            }
                        }
                    })
                })
                .catch(err => {
                    requestUpdateJwt();
                    console.error(err);
                })

        } else {
            // create new tags and return id
            const newTagId = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/db/tags/create_tag`,
                {
                    name: newVal.trim() // only filter the extra spaces, this section is case sensitive
                },
                {
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    },
                    withCredentials: true
                }
            )
                .then(res => {
                    return res.data.tagId; // parse 
                })
                .catch(err => {
                    requestUpdateJwt();
                    console.error(err);
                })

            // create note tag relation with new tagId
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/db/note_tags_relation/create_note_tags_relation`,
                {
                    noteId: selectedNote.noteId,
                    tagId: newTagId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    },
                    withCredentials: true
                }
            )// update tags local state
                .then(res => {
                    // update local state
                    setSelectedNote(prev => {
                        return {
                            ...prev,
                            tags: {
                                ...prev.tags,
                                [newTagId]: newVal
                            }
                        }
                    })
                    // update global state
                    setNoteViewData(prevNoteViewData => {
                        return {
                            ...prevNoteViewData,
                            [selectedNote.noteId]: {
                                ...prevNoteViewData[selectedNote.noteId],
                                tags: {
                                    ...prevNoteViewData[selectedNote.noteId].tags,
                                    [newTagId]: newVal
                                }
                            }
                        }
                    })
                    // update tags lookup and global view state
                    setTagNamesLookup(prev => {
                        return {
                            ...prev,
                            [newTagId]: {
                                id: newTagId,
                                name: newVal
                            }
                        }
                    })
                    setTagsViewData(prev => {
                        return {
                            ...prev,
                            [newTagId]: {
                                id: newTagId,
                                name: newVal,
                                slug: newVal.toLowerCase().replace(/\s+/g, '-')
                            }
                        }
                    })
                })
                .catch(err => {
                    requestUpdateJwt();
                    console.error(err);
                });


        }

    }
    async function createNewNoteExistTags(tagId) {
        // TODO: create note tags relation based on existing tag, pass tagId
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/db/note_tags_relation/create_note_tags_relation`,
            {
                noteId: selectedNote.noteId,
                tagId: tagId
            },
            {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
                withCredentials: true
            }
        )
            // update global state
            .then(res => {
                setSelectedNote(prev => {
                    return {
                        ...prev,
                        tags: {
                            ...prev.tags,
                            [tagId]: tagsViewData[tagId].name
                        }
                    }
                })
                // update global state
                setNoteViewData(prevNoteViewData => {
                    return {
                        ...prevNoteViewData,
                        [selectedNote.noteId]: {
                            ...prevNoteViewData[selectedNote.noteId],
                            tags: {
                                ...prevNoteViewData[selectedNote.noteId].tags,
                                [tagId]: tagsViewData[tagId].name
                            }
                        }
                    }
                })
            })
            .catch(err => {
                requestUpdateJwt();
                console.error(err);
            })
            .finally(() => {
                setNewTagValue('');
            })

    }

    // mini components
    function addExistingTags() {
        const showTags = Object.entries(tagsViewData)
            .filter(([id, data]) =>
                !selectedNote.tags[id] && // Filter tag yang belum ada di note
                data.name.toLowerCase().includes(newTagValue.toLowerCase()) // Filter berdasarkan input user
            )
            .map(([id, data]) => {
                return <li
                    onClick={() => {
                        // TODO: create note tags relation based on existing tag
                        createNewNoteExistTags(id);
                    }} key={id}>{data.name}</li>
            })
        const children = showTags.length;
        return <>
            {children > 0 &&
                <ol className="absolute bg-gray-200 min-w-[90px] min-h-[20px] border-[1px] rounded-md p-2 flex flex-col gap-2 w-fit [&_li]:hover:scale-110 transition-transform ease-in-out duration-200 [&_li]:cursor-pointer dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">
                    {/* filter if the input and the nametag match */}
                    {showTags}
                </ol>
            }
        </>
    }

    //
    return (<>
        <form onSubmit={(e) => handleSubmit(e)} className="min-w-full flex flex-col [&_*]:font-mono h-full overflow-auto">
            <div className="group bg-gray-100 p-4 rounded-b-xl border-b-[1px] border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                <div className="" > {/* navigation container */}
                    <button type="button" onClick={() => { handleSaveClosedNote(); }} className="cursor-pointer pb-2 hover:scale-[1.2] transition-transform ease-in-out duration-150"> <i className="fa-solid fa-arrow-left"></i></button>
                </div>
                {/* title container */}
                <div className={"flex items-center [&_*]:font-mono [&_*]:mb-1"} > {/* title section */}
                    <input type="text" placeholder="title..." value={selectedNote.title || ''} onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })} className="flex-1 pl-3 overflow-hidden whitespace-nowrap text-ellipsis font-bold text-[1.4em] outline-none bg-transparent"></input>
                </div>
                {showEditMetadata &&
                    <div className="">
                        <button type="button" onClick={() => setSelectedNote({ ...selectedNote, isFavorite: !selectedNote.isFavorite })} className="max-w-fit pl-2 font-bold" aria-label="Favorite">
                            Set as favorite:
                            <i className={selectedNote.isFavorite || false ? "fa-solid fa-square-check pl-3 text-blue-500" : "fa-regular fa-square pl-3"}></i>
                        </button>
                        <br></br>
                        <button type="button" onClick={() => setSelectedNote({ ...selectedNote, isArchive: !selectedNote.isArchive })} className="max-w-fit pl-2 font-bold" aria-label="Archive">
                            Set as Archived:
                            <i className={selectedNote.isArchive || false ? "fa-solid fa-square-check pl-3 text-blue-500" : "fa-regular fa-square pl-3"}></i>
                        </button>
                        <div className="flex justify-start">
                            <h3 className=" rounded-xl w-fit px-2 text-center font-bold">Tags: </h3>
                            {/* load all valid tags */}
                            <ol className="flex flex-col pt-[4px] pb-[4px] gap-2 [&_li]:border-[1px] [&_li]:border-black [&_li]:rounded-lg [&_li]:text-[0.7em] [&_li]:px-1 [&_li]:w-fit dark:[&_li]:border-gray-500">
                                {selectedNote.tags && Object.entries(selectedNote.tags).map(([key, value]) => {
                                    return (
                                        <li key={key} > {/* pass tagId */}
                                            {value} <i onClick={(e) => { handleDeleteNoteTags(e, key); }} key={key} className='fa-solid fa-xmark cursor-pointer transition-colors ease-in-out duration-75 hover:text-red-500'></i>
                                        </li>
                                    )
                                })}
                                <div className="flex items-start">
                                    <div>
                                        <input
                                            style={{ width: newTagValue.length + "ch" }}
                                            type="text"
                                            className={`outline-none min-w-[5ch] `}
                                            value={newTagValue || ""}
                                            onChange={(e) => { setNewTagValue(e.target.value); }}
                                            placeholder="new...">
                                        </input>
                                        {
                                            newTagValue && addExistingTags()
                                        } {/* hnya tampil saat ada user type in */}
                                    </div>
                                    <br></br>
                                    {/** TODO: implement new tag post
                                         * if tag already exist (if any maching name, or existed tag being selected), create connection between tags and selected note
                                         * if tag didnt exist , create tags and create connection between tags and selected note
                                         */}                                { /* this is accept button, implement note save on click */}
                                    {newTagValue && <button type="button" onClick={() => { createNewNoteTags(); }}><i className="fa-solid fa-check ml-2 mt-[1px] cursor-pointer hover:text-green-500"></i></button>}

                                </div>
                            </ol>
                        </div>
                        <p className="flex-1 text-[1em] pl-2 font-bold">Created date: <i className="font-light dark:text-gray-400">{date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</i></p>
                    </div>
                }
                <button type="button" className="ml-3" onClick={(e) => { if (selectedNote) editMetadata(e); }}><i className={showEditMetadata ? "fa-solid fa-angle-up hover:scale-120 transition-transform ease-in-out duration-150" : "fa-solid fa-angle-down hover:scale-120 transition-transform ease-in-out duration-150"}></i></button>
            </div>
            <textarea value={selectedNote.content || ""} onChange={(e) => setSelectedNote(prev => ({ ...prev, content: e.target.value }))} type="text" placeholder="write your notes here..." className="flex-1 font-light overflow-auto text-[1em] pl-5 mb-[6px] outline-none pt-4 h-full bg-transparent dark:text-gray-300 dark:placeholder-gray-500"></textarea> {/* implement rest if the description length is reaching a certain point */}
        </form>
    </>)
}