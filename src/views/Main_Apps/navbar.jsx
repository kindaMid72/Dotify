/**
 * TODO: add search features, otomatically search for title and maching tags
 * TODO: add user profile
 * TODO: add theme switcher features
 */

import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authToken } from '../router';
import { sharedContext } from './Notes_App';

// components
import Confirmation_Card from '../components/Confirmation_Card';


function Navbar(props) {
    const navigate = useNavigate();

    // state
    const userMenuRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    const { jwt, setJwt, requestUpdateJwt } = useContext(authToken);
    const [showWarning, setShowWarning] = useState(null);

    // shared context
    const {
        searchQuery, setSearchQuery,
        themeMode, setThemeMode,
        sideBarActive, setSideBarActive

    } = useContext(sharedContext);

    // handler
    useEffect(() => {
        // theme handler
    }, [themeMode]);
    useEffect(() => {
        function handleClickOutside(e) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [userMenuRef])
    useEffect(() => {
        if (themeMode === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    }, [themeMode])

    async function handleLogout() {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/db/users/logout`, {},
            {
                withCredentials: true
            }
        )
        setJwt(null);
        navigate('/'); // kembali ke halaman login setelah logout berhasil
    }
    function handleThemeChange() {
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
    }
    async function handleDeleteAccount(){
        setShowWarning(
        <Confirmation_Card title="Delete Account" message="Are you sure you want to delete your account?" delayConfirm={true}
            onConfirm={() => {
                const tempJwt = jwt; // simpan jwt sebelum menghapus akun
                setShowWarning(null);
                handleLogout(); // logout terlebih dahulu sebelum menghapus akun
                axios.delete(`${import.meta.env.VITE_API_BASE_URL}/db/users/delete_user`, {
                    headers: {
                        Authorization: `Bearer ${tempJwt}`
                    }
                }).catch(err => {
                    console.log(err);
                })
            }}
            onCancel={() => {
                setShowWarning(null);
            }}
        />
        )
    }


    return <>
        {showWarning}
        <nav id="container" className="p-2 pr-4 bg-gray-200 border-b-[2px] border-gray-300 dark:bg-gray-800 dark:border-gray-700">
            <ol className=" flex justify-end items-center gap-1.5 flex-1">
                <div className='flex-1 flex items-center justify-between'>
                    <li className='ml-3' onClick={() => setSideBarActive(prev => !prev)}>
                        <i className="fa-solid fa-bars text-black dark:text-white cursor-pointer hover:text-blue-500 scale-125 transition-colors duration-150 ease-in-out"></i>
                    </li>
                    <li className="hidden justify-start items-center flex-1 pl-4 md:flex">
                        <img src="../src/assets/Logo_Only.png" className="w-[25px]"></img>
                        <p className="font-bold text-xl font-mono pl-2 dark:text-gray-200">Dotify</p>
                    </li>
                </div>
                <li className="group border-2 border-black p-2 rounded-xl flex justify-center items-center pl-3 pr-1  focus-within:bg-gray-100 bg-gray-200 transition-colors duration-300 ease-in-out dark:bg-gray-700 dark:border-gray-500 dark:focus-within:bg-gray-600">{/* place holder */}
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="outline-none w-[165px] bg-transparent transition-colors duration-300 ease-in-out dark:text-gray-200"
                            placeholder="Search..."></input>
                        <button type="submit" className="mr-3 group-focus-within:bg-gray-100 dark:group-focus-within:bg-gray-600 transition-colors duration-300 ease-in-out dark:text-gray-300">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </form>
                </li>
                <li onClick={handleThemeChange} className="border-2 border-black rounded-full bg-gray-100 size-[35px] p-1.5 flex justify-center items-center cursor-pointer dark:bg-gray-700 dark:border-gray-500 dark:text-gray-300">
                    <i className={themeMode === 'light' ? "fa-solid fa-moon" : "fa-solid fa-sun"}></i>
                </li>
                <li ref={userMenuRef} id="user-profile" className="relative ">
                    <button onClick={() => setShowMenu(prev => !prev)} className="border-2 border-black bg-gray-100 rounded-full size-[35px] p-1.5 flex justify-center items-center cursor-pointer dark:bg-gray-700 dark:border-gray-500 dark:text-gray-300">
                        <i className="fa-solid fa-user" ></i>
                    </button>
                    {/* 2. Menu sekarang menjadi anak dari elemen yang memiliki ref */}
                    <div className={showMenu ? `absolute rounded-md w-max bg-gray-300 p-3 top-full mt-2 right-0 z-20 dark:bg-gray-700 dark:border dark:border-gray-600` : `hidden`}>
                        <h3 className='pb-3 dark:text-gray-200'>{jwt ? JSON.parse(atob(jwt.split('.')[1])).email : 'User'}</h3>
                        <hr className="border-gray-400 dark:border-gray-600" />
                        <button onClick={handleLogout} className='pt-2 text-red-700 hover:text-red-400 w-full text-left dark:text-red-400 dark:hover:text-red-300'>Logout</button>
                        <button onClick={handleDeleteAccount} className='pt-2 text-red-700 hover:text-red-400 w-full text-left dark:text-red-400 dark:hover:text-red-300'>Delete Account</button>
                    </div>
                </li>
            </ol>

        </nav>


    </>
}

export default Navbar;