
export default () => {
    return (
        <>
            <div id="Header" className="flex items-center w-full h-20 border-b-2 border-gray-300">
                <div className="pl-4 pt-4 flex-1"> {/* category section */}
                    <h1 className="text-[1.2em] font-bold font-mono">All Notes</h1> {/* based on sidebar selection */}
                    <p className="font-mono">24 notes</p> {/* based on the number of notes available on that category */}
                </div>

                <div className="flex border-2 border-black h-[40px] justify-around items-center rounded-xl"> {/* view mode section (grid/list) */}
                    <i className="fa-solid fa-grip m-2 px-0.5"></i>
                    <div className="h-full border-black border-r-2 w-[0.5px]"></div>
                    <i className="fa-solid fa-list m-2 px-0.5"></i>
                </div>
                <div className="px-2 mx-3 border-2 border-black rounded-xl h-[40px] flex justify-center items-center">{/* sort section */}
                    <select className="outline-none font-mono font-bold ">
                        <option value="date">date</option>
                        <option value="last edited">last edited</option>
                        <option value="date">date</option>
                    </select>
                </div>
            </div>



        </>)
}