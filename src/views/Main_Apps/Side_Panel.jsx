import { useState } from "react";

function Side_Panel({ activeNote, setActiveNote, activeCategory, setActiveCategory }) {

    function category(type) { // all, favorite, archive, ect
        setActiveCategory(type);
    }
    function setActiveClass(type) {
        return type === activeCategory ?
            "hover:rounded-md hover:p-1 origin-left w-full bg-blue-200 border-2 !border-blue-300"
            :
            "hover:bg-gray-300 hover:rounded-md hover:p-1 origin-left w-full";
    }
    const [focusTags, setFocusTags] = useState('hidden');

    return <>
        <div className=' p-3 w-[250px] flex flex-col items-center border-gray-300 border-r-2 pl-6 [&_*]:mb-1 [&_*]:font-mono [&_*]:font-extrabold [&_*]:cursor-pointer bg-gray-100 [&_li]:p-1 [&_li]:rounded-md [&_li]:border-2 [&_li]:border-transparent [&_li]:transition-color [&_li]:ease-in [&_li]:duration-200 '>
            <button onClick={() => setActiveNote(true)} className='border-2 w-full border-transparent rounded-md px-2 py-1 bg-blue-950 text-white font-mono font-[900] !mb-5 hover:bg-blue-800 transition-colors ease-in duration-200'>+ New Note</button>
            <ol className=' flex flex-col justify-start w-[200px] items-start gap-2 [&_i]:mr-2 overflow-auto'>
                <li onClick={() => category('all')} className={setActiveClass('all')}><i className="fa-solid fa-clipboard "></i>All Notes</li>
                <li onClick={() => category('favorite')} className={setActiveClass('favorite')}><i className="fa-solid fa-star "></i>Favorite</li>
                <li onClick={() => focusTags === 'hidden' ? setFocusTags('block') : setFocusTags('hidden')} className={setActiveClass('')}><i className="fa-solid fa-tags"></i>Tags</li>
                <li className={`${focusTags} w-full !pl-3 flex`}>
                    <div className="border-x-1 border-black mr-2"></div>
                    <ol className="flex flex-1 flex-col overflow-hidden [&_li]:overflow-hidden [&_li]:whitespace-nowrap [&_li]:text-ellipsis">
                        <li className={setActiveClass('tag1')} onClick={() => setActiveCategory('tag1')}>tag1</li>
                        <li className={setActiveClass('tag2')} onClick={() => setActiveCategory('tag2')}>tag2</li>
                        <li className={setActiveClass('tag3')} onClick={() => setActiveCategory('tag3')}>tag3</li>
                    </ol>
                </li>
                <li onClick={() => category('archived')} className={setActiveClass('archived')}><i className="fa-solid fa-box-archive"></i>Archived</li>
                <li onClick={() => category('trash')} className={setActiveClass('trash')}><i className="fa-solid fa-trash"></i>Trash</li>
            </ol>
        </div>


    </>
}

export default Side_Panel;