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
        await requestUpdateJwt().then(res => navigate('/notes'))
                                .catch(err => navigate('/login'))
    }

    return (
        <>
            <nav>
                <ol className="flex justify-start gap-15 w-full items-center [&_*]:font-mono py-3 pl-7 border-b-1 border-black">
                    <li className="flex items-center cursor-pointer" onClick={() => navigate('/')}>{/* this is main page */}
                        <img src="../src/assets/Logo_Only.png" alt="logo" className="w-9"></img>
                        <h1 className="font-mono font-extrabold pl-3 !text-[2.1em]">Dotify</h1>
                    </li>
                    <li onClick={() => navigate('/whyUs')} className="text-[1.3em] font-bold cursor-pointer">Why Us?</li>
                    <li onClick={() => navigate('/features')} className="text-[1.3em] font-bold cursor-pointer">Features</li>
                    <li onClick={() => navigate('/faq')} className="text-[1.3em] font-bold cursor-pointer">Faq</li>
                    <li onClick={() => handleOpenApps()} className="text-[1.2em] font-bold flex-1 text-end pr-7 "> {/* to login pages */}
                        <button className="border-3 border-gray-300 px-3 rounded-2xl cursor-pointer">Open Notes <i className="fa-solid fa-arrow-right"></i></button>
                    </li>
                </ol>
            </nav>


        </>
    )
}