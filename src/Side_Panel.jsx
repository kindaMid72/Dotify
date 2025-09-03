import {useState, useEffect} from 'react';

function Side_Panel () {


    return <>
        <div className='p-3 w-[250px] flex flex-col items-center border-gray-300 border-r-2 pl-6 [&_*]:mb-2 [&_*]:font-mono [&_*]:font-extrabold [&_*]:cursor-pointer bg-gray-100'>
            <button className='border-2 w-full border-black rounded-md px-2 py-1 bg-blue-950 text-white font-mono font-[900] !mb-5'>+ New Note</button>
            <ol className=' flex flex-col justify-start w-[200px] items-start gap-2 flex-grow [&_i]:mr-2'>
                <li><i className="fa-solid fa-clipboard"></i>All Notes</li>
                <li><i className="fa-solid fa-star"></i>Favorite</li>
                <li><i className="fa-solid fa-tags"></i>Tags</li>
                <li><i className="fa-solid fa-box-archive"></i>Archived</li>
                <li className=''><i className="fa-solid fa-trash"></i>Trash</li>
            </ol>
        </div>

    
    </>
}

export default Side_Panel;