/**
 * FIXME: update db for metadata triggered every second, content debounce is kinda fine
 *  FIXME: enter key trigger reload
 * FIXME: some error occur when load
 * TODO: add tags to note
 * TODO: notes content edits
 * 
 */

import axios from 'axios';
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { sharedContext } from "../Notes_App.jsx";

// shared context
import { authToken } from "../../router.jsx";

export default function () {
    //shared context
    const { activeNote, setActiveNote, selectedNote, setSelectedNote, noteViewData, setNoteViewData } = useContext(sharedContext);
    const { jwt, setJwt } = useContext(authToken);

    const date = new Date(selectedNote.createdAt);

    // state
    const [tags, setTags] = useState([]); // active tags
    const [newTag, setNewTag] = useState(false);
    const [newTagValue, setNewTagValue] = useState("");
    const isMounted = useRef(false);

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
        }, [value]);
        return debouncevalue;
    }

    // handler
    function handleSubmit(e) {
        e.preventDefault();
    }

    // metadata debouncer
    // Memoize the dependency array for the metadata debouncer
    const metadataDependencies = useMemo(() => {
        return [selectedNote.title, selectedNote.isArchive, selectedNote.isFavorite, selectedNote.tags];
    }, [selectedNote.title, selectedNote.isArchive, selectedNote.isFavorite, selectedNote.tags]);

    const updateMetadataTrigger = useDebounce(metadataDependencies, 1000);
    useEffect(() => { // use effect for metadata update
        if (!isMounted.current) { // pastikan useEffect tidak dijalankan saat content pertamakali di load
            isMounted.current = true;
            return;
        }
        const updateNote = async () => {
            // update in database
            try {
                // Gunakan await untuk menunggu respons dari server
                const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/db/notes/edit_note_metadata`,
                    {
                        noteId: selectedNote.noteId,
                        title: selectedNote.title,
                        isFavorite: selectedNote.isFavorite,
                        isArchive: selectedNote.isArchive,
                        isTrash: selectedNote.isTrash
                    },
                    {
                        headers: { 'Authorization': `Bearer ${jwt}` },
                        withCredentials: true
                    }
                );

                setNoteViewData(prevNoteViewData => ({
                    ...prevNoteViewData,
                    [selectedNote.noteId]: {
                        id: selectedNote.noteId,
                        title: selectedNote.title,
                        is_favorite: selectedNote.isFavorite,
                        is_archive: selectedNote.isArchive,
                        is_trash: selectedNote.isTrash,
                        // TODO: add tags
                        created_at: selectedNote.createdAt,
                        updated_at: Date.now()
                    }
                }));
                // if(response.status <= 300){
                //     console.log("Note metadata updated successfully:", response.data);
                // }
            } catch (err) {
                console.error("Failed to update note:", err.response?.data || err.message);
            }
        }
        updateNote();
    }, [updateMetadataTrigger])

    // content debouncer
    const contentUpdateTrigger = useDebounce(selectedNote.content, 1500);
    useEffect(() => {
        if (!isMounted.current) { // ensure the useEffect only runs when the component is mounted
            isMounted.current = true;
            return;
        }
        const updateContent = async () => {
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
                // if (response.status <= 300) {
                //     console.log("Note content updated successfully:", response.data);
                // }
            } catch (err) {
                console.error("Failed to update note content:", err.response?.data || err.message);
            }
        }
        updateContent();
    }, [contentUpdateTrigger]);


    // utils function
    const [showEditMetadata, setShowEditMetadata] = useState(false);
    function editMetadata(e) {
        e.preventDefault();
        setShowEditMetadata(!showEditMetadata);
    }

    // mini components
    function addExistingTags() {
        const tags = ["tag1", "tag2", "tag3"]; // filter matching tags according to user input
        return <>
            <div> { /* implement search  */}
                <ol className="absolute bg-gray-200 border-[1px] rounded-md p-2 flex flex-col gap-2 w-fit [&_li]:hover:scale-110 transition-transform ease-in-out duration-200 [&_li]:cursor-pointer">
                    {tags.map((tag, index) => {
                        return <li onClick={() => { setTags([...tags, tag]); setNewTagValue(""); }} key={tag}>{tag}</li>
                    })}
                </ol>
            </div>
        </>
    }
    //
    return (<>
        <form onSubmit={(e) => handleSubmit(e)} className="min-w-full flex flex-col [&_*]:font-mono h-full overflow-auto">
            <div className="group bg-gray-100 p-4 rounded-b-xl border-b-[1px] border-gray-700">
                <div className="" > {/* navigation container */}
                    <button onClick={() => { setActiveNote(false); setSelectedNote({}); setShowEditMetadata(false); }} className="cursor-pointer pb-2 hover:scale-[1.2] transition-transform ease-in-out duration-150"> <i className="fa-solid fa-arrow-left"></i></button>
                </div>
                {/* title container */}
                <div className={"flex items-center [&_*]:font-mono [&_*]:mb-1"} > {/* title section */}
                    <input type="text" placeholder="title..." value={selectedNote.title} onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })} className="flex-1 pl-3 overflow-hidden whitespace-nowrap text-ellipsis font-bold text-[1.4em] outline-none"></input>
                </div>
                {showEditMetadata &&
                    <div className="">
                        <button type="button" onClick={() => setSelectedNote({ ...selectedNote, isFavorite: !selectedNote.isFavorite })} className="max-w-fit pl-2 font-bold" aria-label="Favorite">
                            Set as favorite:
                            <i className={selectedNote.isFavorite ? "fa-solid fa-star pl-3" : "fa-regular fa-star pl-3"}></i>
                        </button>
                        <br></br>
                        <button type="button" onClick={() => setSelectedNote({ ...selectedNote, isArchive: !selectedNote.isArchive })} className="max-w-fit pl-2 font-bold" aria-label="Archive">
                            Set as Archived:
                            <i className={selectedNote.isArchive ? "fa-solid fa-box-archive pl-3" : "fa-regular fa-box-archive pl-3"}></i>
                        </button>
                        <div className="flex justify-start">
                            <h3 className=" rounded-xl w-fit px-2 text-center font-bold">Tags: </h3>
                            {/* load all valid tags */}
                            <ol className="flex flex-col pt-[4px] pb-[4px] gap-2 [&_li]:border-[1px] [&_li]:border-black [&_li]:rounded-lg [&_li]:text-[0.7em] [&_li]:px-1 [&_li]:w-fit">
                                <li>tags1 <i className="fa-solid fa-xmark"></i></li>
                                <li>tags1 <i className="fa-solid fa-xmark"></i></li>
                                <li>tags1 <i className="fa-solid fa-xmark"></i></li>
                                <div className="flex items-start" onSubmit={(e) => { e.preventDefault(); setNewTag(!newTag); setNewTagValue(""); }}> {/* TODO: dynamic length input */}
                                    <div>
                                        <input
                                            style={{ width: newTagValue.length + "ch" }}
                                            type="text"
                                            className={`outline-none min-w-[5ch] `}
                                            value={newTagValue}
                                            onChange={(e) => { setNewTagValue(e.target.value); }}
                                            placeholder="new...">
                                        </input>
                                        {newTagValue && addExistingTags()} {/* hnya tampil saat ada user type in */}
                                    </div>
                                    <br></br>
                                    {newTagValue && <button type="submit"><i onClick={() => { setTags([...tags, newTagValue]); setNewTagValue(""); }} className="fa-solid fa-check ml-2 mt-[1px] cursor-pointer"></i></button>}

                                </div>
                            </ol>
                        </div>
                        <p className="flex-1 text-[1em] pl-2 font-bold">Created date: <i className="font-light">{date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</i></p>
                    </div>
                }
                <button className="ml-3" onClick={(e) => editMetadata(e)}><i className={showEditMetadata ? "fa-solid fa-angle-up hover:scale-120 transition-transform ease-in-out duration-150" : "fa-solid fa-angle-down hover:scale-120 transition-transform ease-in-out duration-150"}></i></button>
            </div>
            <textarea value={selectedNote.content} onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })} type="text" placeholder="write your notes here..." className="flex-1 font-light overflow-auto text-[1em] pl-5 mb-[6px] outline-none pt-4 h-full"></textarea> {/* implement rest if the description length is reaching a certain point */}
        </form>
    </>)
}