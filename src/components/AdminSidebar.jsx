// InstructorSidebar.js
import React from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import { logout } from '../slices/adminAuthSlice';
import { useAdminLogoutMutation } from '../slices/adminApiSlice';




const AdminSidebar = () => {

    const dispatch = useDispatch();
const adminInfo = useSelector((state)=>state.adminauth.AdminInfo) 
const [logoutApiCall] = useAdminLogoutMutation();
const navigate = useNavigate()


    const  handleLogout = async ()=>{
          
           await logoutApiCall().unwrap()
           dispatch(logout())
           navigate('/admin')
 
    }

    return (
        <div className="d-flex flex-column flex-shrink-0 p-2  bg-light" style={{ width: '250px', height: '100vh', position: 'fixed' }}>
            <h1 style={{fontFamily:'monospace'}}>Aspire </h1>
            <h5 style={{fontFamily:"monospace"}} className='mt-2'>WElCOME {adminInfo?.name}</h5>
            <h3>Admin Panel</h3>
            <ul className="nav nav-pills flex-column mb-auto">

                <li className="nav-item">
                    <Link to="/admin/dashboard" className="nav-link active" aria-current="page">
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link to="/admin/students" className="nav-link">
                        Students
                    </Link>
                </li>

                <li>
                    <Link to="/admin/revenue" className="nav-link">
                        Revenue
                    </Link>
                </li>

                <li>
                    <Link to="/admin/courses" className="nav-link">
                        Courses
                    </Link>
                </li>
                
                <li>
                    <Link to="/admin/Categories" className="nav-link">
                        Categories
                    </Link>
                </li>

                <li>
                    <button onClick={handleLogout}  className="btn btn-link nav-link " style={{ textAlign: 'left' }}>
                        LOGOUT
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default AdminSidebar;
