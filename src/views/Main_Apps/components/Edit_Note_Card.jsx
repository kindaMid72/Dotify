import { useState } from "react";

export default function (){
    const [isFavorite, setIsFavorite] = useState(false);
    const [notes, setNotes] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);

    return (<>
        <div className="w-full border-2 border-gray-700 p-4 rounded-xl flex flex-col [&_*]:font-mono">
            <div className="flex items-center [&_*]:font-mono [&_*]:mb-1"> {/* title section */}
                <h2 className="flex-1 pr-3 overflow-hidden whitespace-nowrap text-ellipsis font-bold text-[1.1em]">Meeting Notes</h2>
                <button type="button" className="p-1" aria-label="Favorite">
                    <i className={isFavorite? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                </button>
                <button type="button" className="p-1" aria-label="More options">
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
            </div>
            <p className="font-light text-[0.9em] mb-[6px]   overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">lorem ipsum dolor sit amet,asdhfjajklsdhfl;ajsdlkfjal;sdkjfl;kasjdfl;kjasdl;kfja;sldkjf;laksjd;flkj;alskdfjl;kasdjf consectetur adipiscing elit. asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf</p> {/* implement rest if the description length is reaching a certain point */}
            <div className="flex items-center "> {/* tag section */}
                <p className="flex-1 text-[0.8em] font-bold">jan 1, 2025</p>
                <h3 className="border-[1px] border-black rounded-xl px-2 text-center text-[0.8em]">Tags!</h3>
            </div>
        </div>


    </>)
}