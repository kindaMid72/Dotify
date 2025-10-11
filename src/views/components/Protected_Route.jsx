import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { authToken } from "../router.jsx";
import Skeleton_Loading from "./Skeleton_Loading.jsx";

export default () => { // accept a callback for checking autentication
    const {
        jwt, requestUpdateJwt
    } = useContext(authToken);

    useEffect(() => {

    }, [jwt])

    // Jika sudah ada JWT, tampilkan konten yang diproteksi.
    if (jwt) {
        return <Outlet />;
    }else{
        requestUpdateJwt();
    }

    // Jika belum ada JWT, tampilkan skeleton loading.
    // Logika di useEffect akan menangani redirect jika diperlukan.
    return <Skeleton_Loading />;
}
