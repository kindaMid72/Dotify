import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';

// landing page
import Front_Page from './Landing_Page/Main_Page.jsx';
import Front_Index from './Landing_Page/Index.jsx';
import Front_Why_Us from './Landing_Page/Why.jsx';
import Front_Features from './Landing_Page/Features.jsx';
import Front_Faq from './Landing_Page/Faq.jsx';

// login page
import Login_Page from './Login_Page/Main_Login.jsx';

// main Apps
import Notes_App from './Main_Apps/Notes_App.jsx';

function App() {
  const route = createBrowserRouter([
    {
      path: '/',
      element: <Front_Page />, // all children from this page will be mounted in <Outlet/>
      children: [
        {index: true, element: <Front_Index /> },
        {path: 'WhyUs', element: <Front_Why_Us/>},
        {path: 'features', element: <Front_Features/>},
        {path: 'faq', element: <Front_Faq/>}
      ]
    },
    { path: '/login', element: <Login_Page/> }, // TODO: create ui for login
    { path: '/notes', element: <Notes_App /> }, // TODO: add some functionality
    { path: '/*', element: <h1 className='pt-10 text-center'>this address goes nowhere, click <Link to='/' className='font-black'>Here</Link> to the landing page</h1> } //TODO: add UI
  ])

  return (
    <>
      <RouterProvider router={route} />
    </>
  )
}

export default App;
