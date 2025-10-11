import { Outlet } from 'react-router-dom';
import Navbar from './navbar.jsx';

export default () => {


    return (
        <>
            <Navbar />
            <Outlet />
        </>

    );
}