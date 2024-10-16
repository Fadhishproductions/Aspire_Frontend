import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/instructorAuthslice';
import { useInstructorLogoutMutation } from '../slices/instructorApiSlice';

const InstructorSidebar = ({ currentPage }) => {
    const dispatch = useDispatch();
    const instructorInfo = useSelector((state) => state.instructorauth.instructorInfo);
    const [logoutApiCall] = useInstructorLogoutMutation();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/instructor');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const getNavLinkClass = (page) => {
        return currentPage === page ? 'nav-link active' : 'nav-link';
    };

    return (
        <div className="d-flex flex-column flex-shrink-0 p-2 bg-light" style={{ width: '250px', height: '100vh', position: 'fixed' }}>
            <h1 style={{ fontFamily: 'monospace' }}>Aspire</h1>
            <h5 style={{ fontFamily: "monospace" }} className='mt-2'>WELCOME {instructorInfo?.name}</h5>
            <h3>Instructor Panel</h3>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="/instructor/dashboard" className={getNavLinkClass('dashboard')} aria-current="page">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/instructor/courses" className={getNavLinkClass('courses')}>
                        Courses
                    </Link>
                </li>
                {/* <li>
                    <Link to="/instructor/students" className={getNavLinkClass('students')}>
                        Students
                    </Link>
                </li> */}
                <li>
                    <Link to="/instructor/profile" className={getNavLinkClass('profile')}>
                        Profile
                    </Link>
                </li>
                <li>
                    <button onClick={handleLogout} className="btn btn-link nav-link" style={{ textAlign: 'left' }}>
                        LOGOUT
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default InstructorSidebar;
