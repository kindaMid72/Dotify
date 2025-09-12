import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import {useState, useEffect, useContext } from 'react';

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

// shared variable

function Apps () {
    const [isLogin, setIsLogin] = useState(false);

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
        { path: '/login', element: <Login_Page login={isLogin} setLogin={setIsLogin} /> }, // TODO: configure authentication
        { path: '/signin', element: <Sign_In /> },
        {   
            path: '/notes', 
            element: <Protected_Route isLogin={isLogin}/>, // if user is authenticate, will send the Outlet for element placeholder
            children: [
                {index:true, element: <Notes_App/>} // will have a child too
            ]

        }, // TODO: add protected routes
        { path: '/*', element: <h1 className='pt-10 text-center'>this address goes nowhere, click <Link to='/' className='font-black'>Here</Link> to the landing page</h1> } //TODO: add UI
    ]);

    return (<>
        <RouterProvider router={router} />
    </>);

}   

export default Apps;