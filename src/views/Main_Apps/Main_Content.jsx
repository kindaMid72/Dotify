/**TODO: filter on tags category
 *
 */

import { useContext, createContext, useEffect, useState } from "react";
import Notes_Card from "./components/Notes_Card_Grid.jsx";
import { sharedContext } from "./Notes_App.jsx";


export default () => {
    // share context

    const {
        activeNote, setActiveNote, 
        activeCategory, setActiveCategory, 
        notesViewData, setNoteViewData, 
        selectedCategoryView, setSelectedCategoryView,
        tagsViewData, setTagsViewData
     } = useContext(sharedContext);
    // TODO:
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
        } else if(activeCategory === 'trash'){  // trash category, exclude all except trashed note
            const newView = Object.values(notesViewData).filter(note => note.is_trash === 1);
            setSelectedCategoryView({
                ...newView.reduce((container, nextVal) => {
                    container[nextVal.id] = nextVal;
                    return container;
                }, {})
            })
        }else{ // TODO: view based on tags category
            const newView = Object.values(notesViewData).filter(note => note.is_trash === 0)
                                                        .filter(note => note.is_archive === 0)
                                                        .filter(note => note.tags[activeCategory]); // note.tags[tag_id]
            setSelectedCategoryView({
                ...newView.reduce((container, nextVal) => {
                    container[nextVal.id] = nextVal;
                    return container;
                }, {})
            })
        }

    }, [notesViewData, activeCategory]);

    return (
        <div className="p-3 flex flex-1 flex-wrap justify-start content-start items-start gap-2 overflow-auto">
            {Object.values(selectedCategoryView).map((element) => { // TODO: pass tags argument
                return <Notes_Card key={element.id}
                    noteId={element.id}
                    title={element.title}
                    isFavorite={element.is_favorite}
                    isArchive={element.is_archive}
                    isTrash={element.is_trash}
                    tags={element.tags || {}} // pass empty object if no tags
                    created_at={element.created_at}
                    updated_at={element.updated_at}
                />
            })}

        </div>


    );
}