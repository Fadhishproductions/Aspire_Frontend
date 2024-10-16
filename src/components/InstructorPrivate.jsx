import { Navigate,Outlet } from "react-router-dom";
import { useSelector } from "react-redux";



const InstructorPrivate = () => {
    const instructorInfo = useSelector((state)=>state.instructorauth.instructorInfo) 
    
  return instructorInfo ? <Outlet/> : <Navigate to='/instructor' replace /> 
}

export default InstructorPrivate
