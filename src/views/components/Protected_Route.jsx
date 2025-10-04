import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import {authToken} from "../router.jsx";

export default (props) => { // accept a callback for checking autentication
    const navigate = useNavigate();
    const {requestUpdateJwt} = useContext(authToken);
    // check autentication
    if (props.jwt){
        return (<Outlet />); // all protected routes will mounted here
    } else {
        requestUpdateJwt();
        return (<h1 className="text-center w-full font-bold font-mono text-[2em] pt-10">Welcome to Dotify!<br></br>Please login <Link className="text-blue-700 underline" to="/login">here</Link>!</h1>)
    }
}
