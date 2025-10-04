/**
 * TODO: add sort by features, and add new toggle button for asc or desc
 */

import { useContext } from 'react';
import { sharedContext } from './Notes_App';

export default () => {
    const {
        activeCategory, setActiveCategory,
        notesViewData, setNoteViewData,
        activeView, setActiveView,
        activeSort, setActiveSort,
        tagsViewData, setTagsViewData,
        selectedCategoryView, setSelectedCategoryView,
        activeSortDirection, setActiveSortDirection
    } = useContext(sharedContext);

    // handler
    function handleSortOption(e) {
        setActiveSort(e.target.value);
    }

    return (
        <>
            <div id="Header" className="flex items-center w-full h-20 border-b-2 border-gray-300 dark:border-gray-700 dark:text-gray-200">
                <div className="pl-4 pt-4 flex-1"> {/* category section */}
                    <h1 className="text-[0.9em] md:text-[1.2em] font-bold font-mono capitalize">{isNaN(activeCategory) ? activeCategory : (tagsViewData[activeCategory]?.name || activeCategory)} Note</h1> {/* based on sidebar selection */}
                    <p className="font-mono dark:text-gray-400">{Object.values(selectedCategoryView).length} notes</p> {/* based on the number of notes available on that category */}
                </div>
                <div className="hidden md:flex border-2 border-black h-[40px] justify-around items-center rounded-xl dark:border-gray-500"> {/* view mode section (grid/list) */}
                    <i onClick={() => setActiveView('grid')} className="fa-solid fa-grip m-2 px-0.5 hover:scale-105 transition-transform ease-in-out duration-200 hover:text-blue-500 dark:hover:text-blue-400"></i>
                    <div className="h-full border-black border-r-2 w-[0.5px] dark:border-gray-500"></div>
                    <i onClick={() => setActiveView('list')} className="fa-solid fa-list m-2 px-0.5 hover:scale-105 transition-transform ease-in-out duration-200 hover:text-blue-500 dark:hover:text-blue-400"></i>
                </div>
                <div className="px-2 mx-3 border-2 border-black rounded-xl h-[40px] flex justify-center items-center dark:border-gray-500">{/* sort section */}
                    <select value={activeSort} onChange={handleSortOption} className="outline-none font-mono font-bold bg-transparent">
                        <option value="last edited">last edited</option>
                        <option value="title">title</option>
                        <option value="date">date</option>
                    </select>
                </div>

                <button onClick={() => setActiveSortDirection(activeSortDirection === 'desc' ? 'asc' : 'desc')}>
                    {activeSortDirection === 'desc' ?
                        <i className="fa-solid fa-arrow-down-wide-short mr-3"></i>
                        :
                        <i className="fa-solid fa-arrow-up-wide-short mr-3"></i>}
                </button>
            </div>
        </>)
}