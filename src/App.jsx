import { createBrowserRouter, RouterProvider, Link, useNavigate} from 'react-router-dom';
import Front_Page from './Landing_Page/Front_Page.jsx';
import Notes_App from './Main_Apps/Notes_App.jsx';

function App() {
  const route = createBrowserRouter([
    { path: '/', element: <Front_Page /> },
    { path: '/notes', element: <Notes_App /> },
    {path: '/*', element: <h1 className='pt-10 text-center'>this address goes nowhere, click <Link to='/' className='font-black'>Here</Link> to the landing page</h1>}
  ])

  return (
    <>
      <RouterProvider router={route} />
    </>
  )
}

export default App;
