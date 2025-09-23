import Notes_Card from "./components/Notes_Card_Grid.jsx";
import { useContext } from "react";
import { sharedContext } from "./Notes_App.jsx";


export default () => {
    const {activeNote, setActiveNote, activeCategory, setActiveCategory, notesViewData, setNoteViewData} = useContext(sharedContext);
    return (
        <div className="p-3 flex flex-wrap justify-start content-start items-start gap-2 overflow-auto">
            {notesViewData.map((element)=>{ // TODO: pass tags argument
                return <Notes_Card key={element.id}
                            noteId={element.id} 
                            title={element.title} 
                            isFavorite={element.is_favorite} 
                            isArchive={element.is_archive} 
                            tags={element.tags || null}
                            created_at={element.created_at}
                            updated_at={element.updated_at}
                        />
            })}

        </div>



    );
}