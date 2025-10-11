import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// shared context, containt shared data and states
import { authToken } from '../router.jsx';

export default () => {
    const { requestUpdateJwt, jwt, setIsLoading } = useContext(authToken);
    const navigate = useNavigate();

    async function handleOpenApps() {
        setIsLoading(true);
        // Cukup panggil requestUpdateJwt. Navigasi akan ditangani oleh useEffect di router.jsx
        // atau di komponen yang bergantung pada `jwt`.
        await requestUpdateJwt()
            .then(res => navigate('/notes'))
            .catch(err => navigate('/login'))
    }

    return (
        <>
            <nav>
                <ol className="flex justify-start gap-4 md:gap-8 w-full items-center [&_*]:font-mono py-3 px-4 md:pl-7 border-b-1 dark:border-gray-700">
                    <li className="hidden items-center cursor-pointer md:flex" onClick={() => navigate('/')}>{/* this is main page */}
                        <img src="./src/assets/Logo_Only.png" alt="logo" className="w-8 md:w-9"></img>
                        <h1 className="font-mono font-extrabold pl-2 text-2xl md:text-3xl">Dotify</h1>
                    </li>
                    <li onClick={() => navigate('/about')} className="md:block text-lg font-bold cursor-pointer hover:text-blue-600 transition-colors">About Us</li>
                    <li onClick={() => navigate('/features')} className="md:block text-lg font-bold cursor-pointer hover:text-blue-600 transition-colors">Features</li>
                    <li onClick={() => handleOpenApps()} className="font-bold flex-1 text-end cursor-pointer"> {/* to login pages */}
                        <button className="border-2 transition-colors ease-in-out duration-200 border-gray-400 text-sm md:text-base px-4 py-2 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-500 hover:text-white dark:border-gray-500 dark:hover:border-blue-500">Open Notes <i className="fa-solid fa-arrow-right"></i></button>
                    </li>
                </ol>
            </nav>


        </>
    )
}