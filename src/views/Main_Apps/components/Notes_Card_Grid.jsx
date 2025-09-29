/**
 * 
 */

import axios from 'axios';
import { useContext, useEffect, useRef, useState } from "react";

// shared context
import { authToken } from "../../router.jsx";
import { sharedContext } from "../Notes_App.jsx";

export default ({ noteId, title, isFavorite, isArchive, isTrash, tags, created_at, updated_at }) => {
    const { activeNote, setActiveNote, selectedNote, setSelectedNote, noteViewData, setNoteViewData } = useContext(sharedContext);
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
                // note tags here 
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
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/db/notes/delete_note`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
                data: { // Kirim noteId di dalam properti 'data'
                    noteId: noteId,
                },
                withCredentials: true
            }
            );
            if (response.status <= 300) { // hapus note dari view jika delete berhasil
                setNoteViewData(prevNoteViewData => {
                    return {
                        ...Object.values(prevNoteViewData).reduce((container, nextVal) => {
                            if (nextVal.id !== noteId) {
                                container[nextVal.id] = nextVal;
                            }
                            return container;
                        }, {})
                    } // mulai dengan empty object
                })
            }

        } catch (err) {
            console.error(err);
            await requestUpdateJwt();
        }
    }

    return (
        <>  {/* onClick redirect to edit note page */}
            <div onClick={() => editNote()} className="w-[230px] border-2 border-gray-700 p-4 rounded-xl flex flex-col [&_*]:font-mono [&_*]:cursor-pointer cursor-pointer">
                <div className="flex items-center [&_*]:font-mono [&_*]:mb-1"> {/* title section */}
                    <h2 className="flex-1 pr-3 overflow-hidden whitespace-nowrap text-ellipsis font-bold text-[1.1em] ">{title}</h2>
                    <button onClick={() => { /* handle setFavorite */ }} type="button" className="p-1" aria-label="Favorite">
                        <i className={isFavorite ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                    </button>
                    {/* 3. Bungkus tombol dan menu dengan div yang memiliki ref */}
                    <div ref={menuRef} className="relative">
                        <button type="button" onClick={(e) => {
                            e.stopPropagation(); // Hentikan event bubbling agar tidak memicu editNote()
                            setShowMenu(!showMenu);
                        }} className="p-1" aria-label="More options">
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        {/* Pindahkan menu ke sini dan pastikan posisinya benar */}
                        <ol className={showMenu ? "absolute right-0 mt-2 z-10 bg-gray-200 border-[1px] rounded-md p-2 flex flex-col gap-2 w-fit [&_li]:hover:scale-110 transition-transform ease-in-out duration-200 [&_li]:cursor-pointer" : "hidden"}>
                            <li onClick={(e) => deleteNote(e)}>Delete</li>
                            <li onClick={() => editNote()}>Edit</li>
                        </ol>
                    </div>
                </div>
                {/* TODO: implement tags display */}
                <h3 className="border-[1px] w-fit border-black rounded-xl px-2 text-center text-[0.8em]">Tags!</h3>
                <p className="flex-1 text-[0.8em] font-bold">{date}</p>
            </div>

        </>
    );
}