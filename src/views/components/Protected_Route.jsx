import { Link, Outlet, useNavigate } from "react-router-dom";

export default (props) => { // accept a callback for checking autentication
    const navigate = useNavigate();

    // check autentication
    if (props.jwt) {
        return (<Outlet />); // all protected routes will mounted here
    } else {

        return (<h1 className="text-center w-full font-bold font-mono text-[2em] pt-10">Welcome to Dotify!<br></br>Please login <Link className="text-blue-700 underline" to="/login">here</Link>!</h1>)
    }
}
