/**
 * 
 *
 */

import { useContext, useEffect } from "react";
import Notes_Card from "./components/Notes_Card_Grid.jsx";
import { sharedContext } from "./Notes_App.jsx";


export default () => {
    // share context

    const {
        activeNote, setActiveNote,
        activeCategory, setActiveCategory,
        notesViewData, setNoteViewData,
        selectedCategoryView, setSelectedCategoryView,
        tagsViewData, setTagsViewData,
        activeSort, setActiveSort,
        activeSortDirection, setActiveSortDirection,
        searchQuery, setSearchQuery,
    } = useContext(sharedContext);
    // TODO:
    useEffect(() => {

        // 1. CATEGORY SORTING
        let newView = [];
        if (activeCategory === 'all') { // all category, exclude trashed note, PASS
            newView = Object.values(notesViewData).filter(note => note.is_trash === 0)
                .filter(note => note.is_archive === 0);
        } else if (activeCategory === 'favorite') { // all favorite note, exclue trashed note
            newView = Object.values(notesViewData).filter(note => note.is_trash === 0)
                .filter(note => note.is_favorite === 1)
                .filter(note => note.is_archive === 0);
        } else if (activeCategory === 'archive') { // all archived note, exclue trashed note
            newView = Object.values(notesViewData).filter(note => note.is_trash === 0)
                .filter(note => note.is_archive === 1);
        } else if (activeCategory === 'trash') {  // trash category, exclude all except trashed note
            newView = Object.values(notesViewData).filter(note => note.is_trash === 1);
        } else { // TODO: view based on tags category
            newView = Object.values(notesViewData).filter(note => note.is_trash === 0)
                .filter(note => note.is_archive === 0)
                .filter(note => note.tags[activeCategory]); // note.tags[tag_id]
        }
    
        // 2. searchQuery SORTING
        if(searchQuery){ // if there an input in the seach bar
            newView = newView.filter(note => {
                const lowercaseSearchQuery = searchQuery.toLowerCase();
                const validTitle = note.title.toLowerCase().includes(lowercaseSearchQuery);
                const validTags = Object.values(note.tags).some(tag => tag.toLowerCase().includes(lowercaseSearchQuery));
                return (validTitle || validTags);
            })
        }

        // 3. SORTING by activeSort and activeSortDirection
        newView.sort((a, b) => {
            let comparison = 0;
            switch (activeSort) {
                case 'last edited':
                    // Sort by updated_at
                    comparison = b.updated_at - a.updated_at; // Default to descending (newest first)
                    break;
                case 'title':
                    // Sort by title alphabetically
                    comparison = a.title.localeCompare(b.title); // Default to ascending (A-Z)
                    break;
                case 'date':
                    // Sort by created_at
                    comparison = b.created_at - a.created_at; // Default to descending (newest first)
                    break;
                default:
                    return 0;
            }
            // Reverse the order if direction is 'asc' for date-based sorts, or 'desc' for title sort
            return activeSortDirection === 'asc' ? comparison * -1 : comparison;
        });

        // Convert the sorted array back to an object and update the view
        console.log({ newView }, activeSort, activeSortDirection); // PASS, newView updated
        // Keep the data as a sorted array to preserve order
        setSelectedCategoryView(newView);

    }, [notesViewData, activeCategory, activeSort, activeSortDirection, searchQuery]);

    return (
        <div className="p-3 flex flex-1 flex-wrap justify-start content-start items-start gap-2 overflow-auto">
            {selectedCategoryView.map((element) => { // Directly map over the array
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