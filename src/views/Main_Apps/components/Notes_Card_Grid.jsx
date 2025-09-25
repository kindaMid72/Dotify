import axios from 'axios';
import { useContext } from "react";

// shared context
import { authToken } from "../../router.jsx";
import { sharedContext } from "../Notes_App.jsx";

export default ({ noteId, title, isFavorite, isArchive, tags, created_at, updated_at }) => {
    const { activeNote, setActiveNote, selectedNote, setSelectedNote } = useContext(sharedContext);
    const { jwt, setJwt } = useContext(authToken);
    
    async function editNote(e) {
        try{
            setActiveNote(noteId);
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/db/notes/get_note_content/${noteId}`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
                withCredentials: true
            }).then(res => res.data) // get the note content from data
            .catch(err => {
                setJwt(''); // trigger jwt refresh
            });
            setSelectedNote({ 
                noteId: noteId,
                title: title, 
                isFavorite : isFavorite, 
                isArchive : isArchive,
                // note tags here 
                content:response.content,
                createdAt: created_at,
                updatedAt: updated_at
            });
        }catch(err){
            setJwt(''); // trigger jwt refresh
            console.error(err);
        }
    }

    return (
        <>  {/* onClick redirect to edit note page */}
            <div onClick={() => editNote()} className="w-[230px] border-2 border-gray-700 p-4 rounded-xl flex flex-col [&_*]:font-mono">
                <div className="flex items-center [&_*]:font-mono [&_*]:mb-1"> {/* title section */}
                    <h2 className="flex-1 pr-3 overflow-hidden whitespace-nowrap text-ellipsis font-bold text-[1.1em]">{title}</h2>
                    <button type="button" className="p-1" aria-label="Favorite">
                        <i className={isFavorite ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                    </button>
                    <button type="button" className="p-1" aria-label="More options">
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                </div>
                {/* TODO: implement tags display */}
                <h3 className="border-[1px] w-fit border-black rounded-xl px-2 text-center text-[0.8em]">Tags!</h3>
                <p className="flex-1 text-[0.8em] font-bold">jan 1, 2025</p>
            </div>

        </>

    );
}