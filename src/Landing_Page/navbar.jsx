import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default () => {
    const navigate = useNavigate();
    
    return (
        <>
            <nav>
                <ol className="flex justify-start gap-15 w-full items-center [&_*]:font-mono py-3 pl-7 border-b-2 border-black">
                    <li className="flex items-center cursor-pointer" onClick={() => navigate('/')}>{/* this is main page */}
                        <img src="../src/assets/Logo_Only.png" alt="logo" className="w-9"></img>
                        <h1 className="font-mono font-extrabold pl-3 !text-[2.1em]">Dotify</h1>
                    </li>
                    <li onClick={()=> navigate('/whyUs')} className="text-[1.3em] font-bold cursor-pointer">Why Us?</li>
                    <li onClick={()=> navigate('/features')} className="text-[1.3em] font-bold cursor-pointer">Features</li>
                    <li onClick={()=> navigate('/faq')} className="text-[1.3em] font-bold cursor-pointer">Faq</li>
                    <li onClick={()=> navigate('/login')} className="text-[1.2em] font-bold flex-1 text-end pr-7 "> {/* to login pages */}
                        <button className="border-3 border-gray-300 px-3 rounded-2xl cursor-pointer">Log in</button>
                    </li>
                </ol>
            </nav>

        
        </>
    )
}