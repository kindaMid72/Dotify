import { useState } from "react";
import {Link} from 'react-router-dom';

function Navbar (props) {
    return <>
    <nav id="container" className="p-2 pr-4 bg-neutral-300">
        <ol className=" flex justify-end items-center gap-1.5">
            <li className="group border-2 border-black p-2 rounded-full flex justify-center items-center pl-3 pr-1  focus-within:bg-gray-100 bg-gray-200">{/* place holder */}
                <input 
                type="text" 
                className="outline-none w-[165px] focus:bg-gray-100" 
                placeholder="Search..."></input>
                <button className="mr-3 group-focus-within:bg-gray-100">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </li>
            <li className="border-2 border-black rounded-full bg-gray-100 size-[35px] p-1.5 flex justify-center items-center">
                <Link to="#">
                    <i class="fa-regular fa-gear"></i>
                </Link>
            </li>
            <li className="border-2 border-black rounded-full bg-gray-100 size-[35px] p-1.5 flex justify-center items-center">
                <Link to="#" >
                    <i className="fa-solid fa-bell"></i>
                </Link>
            </li>
            <li id="user-profile" className="border-2 border-black bg-gray-100 rounded-full size-[35px] p-1.5 flex justify-center items-center">
                <Link to="#">
                    <i className="fa-solid fa-user"></i>
                </Link>
            </li>
        </ol>
    
    </nav>
        

    </>
}

export default Navbar;