import { useState } from "react";

export default function ({ activeNote, setActiveNote }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [title, setTitle] = useState(""); // 
    const [isArchived, setIsArchived] = useState(false);
    const [notes, setNotes] = useState(""); // store note content
    const date = new Date();

    const [tags, setTags] = useState([]); // active tags
    const [newTag, setNewTag] = useState(false);
    const [newTagValue, setNewTagValue] = useState("");

    function handleSubmit(e) {
        e.target.preventDefault();
    }

    // utils function
    const [showEditMetadata, setShowEditMetadata] = useState(false);
    function editMetadata(e) {
        e.preventDefault();
        setShowEditMetadata(!showEditMetadata);
    }

    // mini components
    function addExistingTags() {
        const tags = ["tag1", "tag2", "tag3"];
        return <>
            <div> { /* implement search  */}
                <ol className="border-[1px] rounded-md p-2 flex flex-col gap-2 w-fit">
                    {tags.map((tag, index) => {
                        return <li onClick={() => {setTags([...tags, tag]); setNewTagValue("");}} key={index}>{tag}</li>
                    })}
                </ol>
            </div>
        </>
    }

    return (<>
        <form onSubmit={handleSubmit} className="min-w-full flex flex-col [&_*]:font-mono h-full overflow-auto">
            <div className="group bg-gray-100 p-4 rounded-b-xl border-b-[1px] border-gray-700">
                <div className="" > {/* navigation container */}
                    <button onClick={() => setActiveNote(false)} className="cursor-pointer pb-2 hover:scale-[1.2] transition-transform ease-in-out duration-150"> <i className="fa-solid fa-arrow-left"></i></button>
                </div>
                {/* title container */}
                <div className={"flex items-center [&_*]:font-mono [&_*]:mb-1"} > {/* title section */}
                    <input type="text" placeholder="title..." value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 pl-3 overflow-hidden whitespace-nowrap text-ellipsis font-bold text-[1.4em] outline-none"></input>
                </div>
                {showEditMetadata &&
                    <div className="">
                        <button type="button" onClick={() => setIsFavorite(!isFavorite)} className="max-w-fit pl-2 font-bold" aria-label="Favorite">
                            Set as favorite:
                            <i onClick={() => setIsFavorite(!isFavorite)} className={isFavorite ? "fa-solid fa-star pl-3" : "fa-regular fa-star pl-3"}></i>
                        </button>
                        <br></br>
                        <button type="button" onClick={() => setIsArchived(!isArchived)} className="max-w-fit pl-2 font-bold" aria-label="Favorite">
                            Set as Archived:
                            <i onClick={() => setIsArchived(!isArchived)} className={isArchived ? "fa-solid fa-box-archive pl-3" : "fa-regular fa-box-archive pl-3"}></i>
                        </button>
                        <div className="flex justify-start">
                            <h3 className=" rounded-xl w-fit px-2 text-center font-bold">Tags: </h3>
                            {/* load all valid tags */}
                            <ol className="flex flex-col pt-[4px] pb-[4px] gap-2 [&_li]:border-[1px] [&_li]:border-black [&_li]:rounded-lg [&_li]:text-[0.7em] [&_li]:px-1 [&_li]:w-fit">
                                <li>tags1 <i className="fa-solid fa-xmark"></i></li>
                                <li>tags1 <i className="fa-solid fa-xmark"></i></li>
                                <li>tags1 <i className="fa-solid fa-xmark"></i></li>
                                <div className="flex items-start"> {/* TODO: dynamic length input */}
                                    <div>
                                        <input 
                                            style={{width: newTagValue.length + "ch"}}
                                            type="text" 
                                            className={`outline-none min-w-[5ch] `} 
                                            value={newTagValue} 
                                            onChange={(e) => { setNewTagValue(e.target.value);}} 
                                            placeholder="new...">    
                                        </input>
                                        {newTagValue && addExistingTags()} {/* hnya tampil saat ada user type in */}
                                    </div>
                                    <br></br>
                                    {newTagValue && <i className="fa-solid fa-check ml-2 mt-[1px]"></i>}

                                </div>
                            </ol>
                        </div>
                        <p className="flex-1 text-[1em] pl-2 font-bold">Created date: <i className="font-light">{date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</i></p>
                    </div>
                }
                <button className="ml-3" onClick={(e) => editMetadata(e)}><i className={showEditMetadata ? "fa-solid fa-angle-up hover:scale-120 transition-transform ease-in-out duration-150" : "fa-solid fa-angle-down hover:scale-120 transition-transform ease-in-out duration-150"}></i></button>
            </div>
            <textarea type="text" placeholder="write your notes here..." className="flex-1 font-light overflow-auto text-[1em] pl-5 mb-[6px] outline-none pt-4 h-full"></textarea> {/* implement rest if the description length is reaching a certain point */}
        </form>


    </>)
}