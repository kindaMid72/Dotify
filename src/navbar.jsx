import { useState } from "react";
import {Link} from 'react-router-dom';

function Navbar (props) {
    return <>
    <nav id="container" className="p-2 pr-4 bg-gray-200 border-b-[2px] border-gray-300">
        <ol className=" flex justify-end items-center gap-1.5">
            <li className="flex justify-start items-center flex-1 pl-4">
                <i class="fa-solid fa-note-sticky pr-3 scale-[1.4] "></i>
                <p className="font-bold text-xl font-mono">FoNote</p>
            </li>
            <li className="group border-2 border-black p-2 rounded-xl flex justify-center items-center pl-3 pr-1  focus-within:bg-gray-100 bg-gray-200 transition-colors duration-300 ease-in-out">{/* place holder */}
                <form>
                    <input
                    type="text" 
                    className="outline-none w-[165px] focus:bg-gray-100 transition-colors duration-300 ease-in-out" 
                    placeholder="Search..."></input>
                    <button type="submit" className="mr-3 group-focus-within:bg-gray-100 transition-colors duration-300 ease-in-out">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </form>
            </li>
            <li className="border-2 border-black rounded-full bg-gray-100 size-[35px] p-1.5 flex justify-center items-center">
                <Link to="#">
                    <i class="fa-solid fa-sliders"></i>
                </Link>
            </li>
            <li className="border-2 border-black rounded-full bg-gray-100 size-[35px] p-1.5 flex justify-center items-center">
                <Link to="#" >
                    <i class="fa-solid fa-circle-half-stroke"></i>
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