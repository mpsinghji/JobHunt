import { useEffect } from "react";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if(user === null || user.role !== "Recruiter"){
            navigate("/");
        }
    }, [user, navigate])
    
    return (
        <>
            {children}
        </>
    )
}
export default ProtectedRoutes;