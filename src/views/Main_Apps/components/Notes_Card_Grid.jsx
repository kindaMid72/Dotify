/**
 * 
 */

import axios from 'axios';
import { useContext, useEffect, useRef, useState } from "react";

// shared context
import { authToken } from "../../router.jsx";
import { sharedContext } from "../Notes_App.jsx";

export default ({ noteId, title, isFavorite, isArchive, isTrash, tags, created_at, updated_at }) => {
    const {
        activeNote, setActiveNote,
        activeView,
        selectedNote, setSelectedNote,
        noteViewData, setNoteViewData,
        tagsViewData, setTagsViewData
    } = useContext(sharedContext);
    const { jwt, setJwt, requestUpdateJwt } = useContext(authToken);
    // display
    let date = new Date(Number(created_at));
    // console.log(typeof(created_at));
    // console.log(date);
    // console.log(typeof(date));
    // date is still a Date object
    date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

    // state
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null); // 1. Buat ref untuk menu

    // custom hooks
    useEffect(() => {
        function handleClickOutside(event) {
            // Jika ref ada dan klik terjadi di luar elemen yang direferensikan
            // menuRef akan berisi elemen yang direferensikan, yaitu div yang berisi dropdown menu
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false); // Tutup menu
                // jika target element yang masuk bukan anak dari ref menuRef, element akan di unmount
            }
        }

        // Tambahkan event listener saat komponen dimuat
        // saat terjadi click di manapun di dokumen, panggil fungsi handleClickOutside
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup function untuk menghapus event listener saat komponen dibongkar
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]); // Dependency array, efek ini hanya berjalan sekali

    // handler
    async function editNote(e) {
        try {
            setActiveNote(noteId);
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/db/notes/get_note_content/${noteId}`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
                withCredentials: true
            }).then(res => res.data) // get the note content from data
                .catch(err => {
                    requestUpdateJwt();
                });
            setSelectedNote({
                noteId: noteId,
                title: title,
                isFavorite: isFavorite,
                isArchive: isArchive,
                isTrash: isTrash,
                tags: tags,
                content: response.content,
                createdAt: created_at,
                updatedAt: updated_at
            });
        } catch (err) {
            setJwt(''); // trigger jwt refresh
            console.error(err);
        }
    }
    async function deleteNote(e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            // set delete permanent or delayed delete
            let response;

            if (isTrash === 1) { // if its already in trash, erase it from database
                response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/db/notes/delete_note`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${jwt}`
                    },
                    data: { // Kirim noteId di dalam properti 'data'
                        noteId: noteId,
                    },
                    withCredentials: true
                }
                ).then(res => {
                    // Hapus note dari view setelah berhasil dihapus dari DB
                    if (res.status <= 300) {
                        setNoteViewData(prevNoteViewData => {
                            const newViewData = { ...prevNoteViewData };
                            delete newViewData[noteId];
                            return newViewData;
                        });
                    }
                    return res;
                });
            } else { // move to trashed category
                response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/db/notes/set_trash`,
                    { // Kirim noteId di dalam properti 'data'
                        noteId: noteId,
                        isTrash: isTrash ? 0 : 1
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${jwt}`
                        },
                        withCredentials: true
                    }
                ).then(res => {
                    // Update status is_trash di view setelah berhasil di DB
                    if (res.status <= 300) {
                        setNoteViewData(prevNoteViewData => {
                            return {
                                ...prevNoteViewData,
                                [String(noteId)]: {
                                    ...prevNoteViewData[noteId],
                                    is_trash: 1
                                }
                            }
                        });
                    }
                    return res;
                });
            }

        } catch (err) {
            console.error(err);
            await requestUpdateJwt();
        }
    }
    async function archiveNote(e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/db/notes/set_archive`,
                {
                    noteId: noteId,
                    isArchive: isArchive ? 0 : 1
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${jwt}`
                    },
                    withCredentials: true
                }
            )
            if (response.status <= 300) {
                setNoteViewData(prevNoteViewData => {
                    return {
                        ...prevNoteViewData,
                        [String(noteId)]: {
                            ...prevNoteViewData[noteId],
                            is_archive: isArchive ? 0 : 1
                        }
                    }
                })
            }
        } catch (err) {
            requestUpdateJwt();
            console.error(err);
        }
    }
    async function setRestore(e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/db/notes/set_trash`,
                { // Kirim noteId di dalam properti 'data'
                    noteId: noteId,
                    isTrash: isTrash ? 0 : 1
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${jwt}`
                    },
                    withCredentials: true
                }
            ).then(res => {
                if (res.status <= 300) {
                    setNoteViewData(prevNoteViewData => {
                        return {
                            ...prevNoteViewData,
                            [String(noteId)]: {
                                ...prevNoteViewData[noteId],
                                is_trash: 0
                            }
                        }
                    })
                }
            })
        } catch (err) {
            requestUpdateJwt();
            console.error(err);
        }
    }
    async function setFavorite(e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/db/notes/set_favorite`,
                {
                    noteId: noteId,
                    isFavorite: isFavorite ? 0 : 1
                },
                {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true,
                }
            )
            if (response.status <= 400) {
                setNoteViewData(prevNoteViewData => {
                    return {
                        ...prevNoteViewData,
                        [String(noteId)]: {
                            ...prevNoteViewData[noteId],
                            is_favorite: isFavorite ? 0 : 1
                        }
                    }
                })
            }
        } catch (err) {
            requestUpdateJwt();
            console.error(err);
        }
    }

    return (
        <>
            {/** grid view */}
            {activeView === 'grid' &&
                <div onClick={() => editNote()} className="md:w-[260px] w-full border-2 border-gray-700 p-4 rounded-xl flex flex-col [&_*]:font-mono [&_*]:cursor-pointer cursor-pointer dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">
                    <div className="flex items-center [&_*]:font-mono [&_*]:mb-1"> {/* title section */}
                        <h2 className="flex-1 pr-3 overflow-hidden whitespace-nowrap text-ellipsis font-bold text-[1.1em] ">{title}</h2>
                        <button onClick={(e) => { setFavorite(e); }} type="button" className="p-1" aria-label="Favorite">
                            <i className={isFavorite ? "fa-solid fa-star text-yellow-400" : "fa-regular fa-star"}></i>
                        </button>
                        {/* 3. Bungkus tombol dan menu dengan div yang memiliki ref */}
                        <div ref={menuRef} className="relative">
                            <button type="button" onClick={(e) => {
                                e.stopPropagation(); // Hentikan event bubbling agar tidak memicu editNote()
                                setShowMenu(!showMenu);
                            }} className="p-1" aria-label="More options">
                                <i className="fa-solid fa-ellipsis-vertical mt-2 "></i>
                            </button>
                            {/* Pindahkan menu ke sini dan pastikan posisinya benar */}
                            <ol className={showMenu ? "absolute right-0 mt-2 z-10 bg-gray-200 border-[1px] rounded-md p-2 flex flex-col gap-2 w-fit [&_li]:hover:scale-105 [&_li]:transition-transform [&_li]:ease-in-out [&_li]:duration-200 [&_li]:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" : "hidden"}>
                                <li className='text-red-600' onClick={(e) => deleteNote(e)}>Delete</li>
                                <li onClick={() => editNote()}>Edit</li>
                                <li onClick={(e) => { archiveNote(e); }}>{isArchive ? "Unarchive" : "Archive"}</li>
                                {isTrash ? <li onClick={(e) => { setRestore(e); }}> restore</li> : ""}
                            </ol>
                        </div>
                    </div>
                    <ol className='flex gap-2 items-center w-full overflow-hidden whitespace-nowrap text-ellipsis dark:text-gray-300'>
                        {Object.values(tags).length > 0 ?
                            Object.values(tags).map((tag) => {
                                return <li key={tag} className='border-[1px] w-fit border-black rounded-xl px-2 text-center text-[0.8em] dark:border-gray-500'>{tag}</li>
                            })
                            :
                            <li className=' w-fit border-black rounded-xl text-center text-[0.8em] font-italic opacity-50'>No tags...</li>
                        }
                    </ol>
                    <p className="flex-1 text-[0.8em] font-bold">{date}</p>
                </div>
            }
            {/** list view */}
            {activeView === 'list' &&
                <div onClick={() => editNote()} className="w-full border-2 [&_*]:mx-[2px] border-gray-700 p-4 rounded-xl flex flex-col justify-center [&_*]:font-mono [&_*]:cursor-pointer cursor-pointer dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">
                    <div className="flex items-center [&_*]:font-mono [&_*]:mb-1"> {/* title section */}
                        <h2 className="flex-1 pr-3 overflow-hidden whitespace-nowrap text-ellipsis font-bold text-[1.1em] ">{title}</h2>
                        <button onClick={(e) => { setFavorite(e); }} type="button" className="p-1" aria-label="Favorite">
                            <i className={isFavorite ? "fa-solid fa-star text-yellow-400" : "fa-regular fa-star"}></i>
                        </button>
                        <ol className='flex gap-2 items-center dark:text-gray-300'>
                            {Object.values(tags).map((tag) => {
                                return <li className='border-[1px] w-fit border-black rounded-xl px-2 text-center text-[0.8em] dark:border-gray-500'>{tag}</li>
                            })}
                        </ol>
                        <p className="pl-3 text-[1.1em] font-bold">{date}</p>
                        <div ref={menuRef} className="relative flex items-center">
                            <button type="button" onClick={(e) => {
                                e.stopPropagation(); // Hentikan event bubbling agar tidak memicu editNote()
                                setShowMenu(!showMenu);
                            }} className="p-1" aria-label="More options">
                                <i className="fa-solid fa-ellipsis-vertical mt-2"></i>
                            </button>
                            {/* Pindahkan menu ke sini dan pastikan posisinya benar */}
                            <ol className={showMenu ? "absolute right-0 top-7 mt-2 z-10 bg-gray-200 border-[1px] rounded-md p-2 flex flex-col gap-2 w-fit [&_li]:hover:scale-105 [&_li]:transition-transform [&_li]:ease-in-out [&_li]:duration-200 [&_li]:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" : "hidden"}>
                                <li className='text-red-600' onClick={(e) => deleteNote(e)}>Delete</li>
                                <li onClick={() => editNote()}>Edit</li>
                                <li onClick={(e) => { archiveNote(e); }}>{isArchive ? "Unarchive" : "Archive"}</li>
                                {isTrash ? <li onClick={(e) => { setRestore(e); }}> restore</li> : ""}
                            </ol>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}