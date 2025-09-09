import { createBrowserRouter, Link } from 'react-router-dom';

// landing page
import Front_Faq from '../views/Landing_Page/Faq.jsx';
import Front_Features from '../views/Landing_Page/Features.jsx';
import Front_Index from '../views/Landing_Page/Index.jsx';
import Front_Page from '../views/Landing_Page/Main_Page.jsx';
import Front_Why_Us from '../views/Landing_Page/Why.jsx';

// login page
import Login_Page from '../views/Login_Page/Main_Login.jsx';
import Sign_In from '../views/Login_Page/Sign_In.jsx';

// main Apps
import Notes_App from '../views/Main_Apps/Notes_App.jsx';

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
    { path: '/login', element: <Login_Page /> }, // TODO: missing logic
    { path: '/signin', element: <Sign_In /> }, // sign in page (ui logic)
    { path: '/notes', element: <Notes_App /> }, // TODO: add some functionality
    { path: '/*', element: <h1 className='pt-10 text-center'>this address goes nowhere, click <Link to='/' className='font-black'>Here</Link> to the landing page</h1> } //TODO: add UI
]);

export default router;