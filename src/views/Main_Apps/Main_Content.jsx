/**TODO: pass tags argument
 * FIXME: when note category get edited, the view does not updated, on selected category the note is missing because the category filter it, but when we open the new category that its pointing to, its not there
 */

import { useContext, useEffect, useState } from "react";
import Notes_Card from "./components/Notes_Card_Grid.jsx";
import { sharedContext } from "./Notes_App.jsx";


export default () => {
    const { activeNote, setActiveNote, activeCategory, setActiveCategory, notesViewData, setNoteViewData } = useContext(sharedContext);
    // TODO:
    const [selectedCategoryView, setSelectedCategoryView] = useState({}); // containt selected category view for main content
    useEffect(() => {
        if (activeCategory === 'all') { // all category, exclude trashed note, PASS
            const newView = Object.values(notesViewData).filter(note => note.is_trash === 0)
                                                        .filter(note => note.is_archive === 0);
            setSelectedCategoryView({
                ...newView.reduce((container, nextVal) => {
                    container[nextVal.id] = nextVal;
                    return container;
                }, {})
            })

        } else if (activeCategory === 'favorite') { // all favorite note, exclue trashed note
            const newView = Object.values(notesViewData).filter(note => note.is_trash === 0)
                                                        .filter(note => note.is_favorite === 1)
                                                        .filter(note => note.is_archive === 0);
            setSelectedCategoryView({
                ...newView.reduce((container, nextVal) => {
                    container[nextVal.id] = nextVal;
                    return container;
                }, {})
            })
        } else if (activeCategory === 'archive') { // all archived note, exclue trashed note
            const newView = Object.values(notesViewData).filter(note => note.is_trash === 0)
                                                        .filter(note => note.is_archive === 1);
            setSelectedCategoryView({
                ...newView.reduce((container, nextVal) => {
                    container[nextVal.id] = nextVal;
                    return container;
                }, {})
            })
        } else {  // trash category, exclude all except trashed note
            const newView = Object.values(notesViewData).filter(note => note.is_trash === 1);
            setSelectedCategoryView({
                ...newView.reduce((container, nextVal) => {
                    container[nextVal.id] = nextVal;
                    return container;
                }, {})
            })
        }

    }, [notesViewData, activeCategory]);

    return (
        <div className="p-3 flex flex-wrap justify-start content-start items-start gap-2 overflow-auto">
            {Object.values(selectedCategoryView).map((element) => { // TODO: pass tags argument
                return <Notes_Card key={element.id}
                    noteId={element.id}
                    title={element.title}
                    isFavorite={element.is_favorite}
                    isArchive={element.is_archive}
                    isTrash={element.is_trash}
                    tags={element.tags || null}
                    created_at={element.created_at}
                    updated_at={element.updated_at}
                />
            })}

        </div>



    );
}