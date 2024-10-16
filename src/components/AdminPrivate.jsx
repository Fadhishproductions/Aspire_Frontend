import { Navigate,Outlet } from "react-router-dom";
import { useSelector } from "react-redux";



const AdminPrivate = () => {
    const {AdminInfo} = useSelector((state)=>state.adminauth)
    
  return AdminInfo ? <Outlet/> : <Navigate to='/admin' replace /> 
}

export default AdminPrivate
