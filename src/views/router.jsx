import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';

// landing page
import Front_Faq from './Landing_Page/Faq.jsx';
import Front_Features from './Landing_Page/Features.jsx';
import Front_Index from './Landing_Page/Index.jsx';
import Front_Page from './Landing_Page/Main_Page.jsx';
import Front_Why_Us from './Landing_Page/Why.jsx';

// login page
import Login_Page from './Registration_Page/Main_Login.jsx';
import Sign_In from './Registration_Page/Sign_In.jsx';

//components 
import Protected_Route from './components/Protected_Route.jsx';

// main Apps
import Notes_App from './Main_Apps/Notes_App.jsx';


function Apps() {
    // AppContext diekspor agar bisa diimpor di komponen lain

    const [jwt, setJwt] = useState(null);
    useEffect(() => { // minta jwt token pertama kali, jika punya refresh token
        // Tambahkan withCredentials: true agar cookie (refreshToken) dikirim
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/db/users/refresh-token`, { withCredentials: true })
            .then(res => {
                setJwt(res.data.accessToken);
            }).catch(err => {
                console.error("No active session found or refresh token is invalid.", err);
            })
    }, []);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Front_Page />, // all children from this page will be mounted in <Outlet/>
            children: [
                { index: true, element: <Front_Index /> },
                { path: 'WhyUs', element: <Front_Why_Us /> },
                { path: 'features', element: <Front_Features /> },
                { path: 'faq', element: <Front_Faq /> }
            ]
        },
        { path: '/login', element: <Login_Page jwt={jwt} setJwt={setJwt} /> }, // TODO: configure authentication
        { path: '/signin', element: <Sign_In /> },
        {
            path: '/notes',
            element: <Protected_Route jwt={jwt} />, // if user is authenticate, will send the Outlet for element placeholder
            children: [
                { index: true, element: <Notes_App /> } // will have a child too
                // setting page
                // profile page
            ]

        },
        { path: '/*', element: <h1 className='pt-10 text-center'>this address goes nowhere, click <Link to='/' className='font-black'>Here</Link> to the landing page</h1> } //TODO: add UI
    ]);

    return (<>
        <AppContext.Provider value={{ jwt, setJwt }}>
            <RouterProvider router={router} />
        </AppContext.Provider>
    </>);

}

export const AppContext = createContext();
export default Apps;