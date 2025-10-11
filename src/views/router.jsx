// 

import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';

// landing page
import Front_Faq from './Landing_Page/Konz.jsx';
import Front_Features from './Landing_Page/Features.jsx';
import Front_Index from './Landing_Page/Index.jsx';
import Front_Page from './Landing_Page/Main_Page.jsx';
import Front_About from './Landing_Page/About.jsx';

// login page
import Login_Page from './Registration_Page/Main_Login.jsx';
import Reset_Password from './Registration_Page/Reset_Password.jsx';
import Sign_In from './Registration_Page/Sign_In.jsx';
export const authToken = createContext(); // shared token context

//components 
import Protected_Route from './components/Protected_Route.jsx';

// main Apps
import Notes_App from './Main_Apps/Notes_App.jsx';


function Apps() {

    // global state
    const [jwt, setJwt] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Front_Page />, // all children from this page will be mounted in <Outlet/>
            children: [
                { index: true, element: <Front_Index /> },
                { path: 'about', element: <Front_About /> },
                { path: 'features', element: <Front_Features /> },
                { path: 'konz', element: <Front_Faq /> }
            ]
        },
        // { path: '/skeleton', element: <Pure_Skeleton /> }, // test skeleton loading
        { path: '/login', element: <Login_Page jwt={jwt} setJwt={setJwt} /> }, // 
        { path: '/signin', element: <Sign_In /> },
        { path: '/reset_password', element: <Reset_Password /> }, //TODO: 
        {
            path: '/notes',
            element: <Protected_Route />, // Protected_Route akan menangani state loading-nya sendiri
            children: [
                { index: true, element: <Notes_App /> } // will have a child too
                // setting page
                // profile page
            ]

        },
        { path: '/*', element: <h1 className='pt-10 text-center'>this address goes nowhere, click <Link to='/' className='font-black'>Here</Link> to the landing page</h1> } //TODO: add UI
    ]);

    // utils function 
    async function requestUpdateJwt() {
        return await axios.get(`${import.meta.env.VITE_API_BASE_URL}/db/users/refresh-token`,
            {
                withCredentials: true
            })
            .then(res => {
                setJwt(res.data.accessToken);
            }).catch(err => {
                console.error("No active session found or refresh token is invalid.", err);
                // Redirect to login page on failure
                router.navigate('/login');
                // Rethrow error to be caught by other handlers if needed
                throw err;
            }).finally(() => {
                setIsLoading(false); // Set loading ke false setelah selesai, baik berhasil maupun gagal.
            })
    }

    return (<>
        <authToken.Provider value={{ jwt, setJwt, requestUpdateJwt, isLoading, setIsLoading }}>
            <RouterProvider router={router} />
        </authToken.Provider>
    </>);

}

export default Apps;