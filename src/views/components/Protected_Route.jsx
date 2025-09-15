import { Outlet, useNavigate } from "react-router-dom";

export default (props) => { // accept a callback for checking autentication
    const navigate = useNavigate();

    // check autentication
    if (props.isLogin) {
        return (<Outlet />); // all protected routes will mounted here
    } else {
        navigate('/WhyUs');
    }
}
