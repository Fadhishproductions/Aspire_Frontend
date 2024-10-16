import React from 'react';
import InstructorSidebar from './InstructorSidebar';

const InstructorLayout = ({ children , currentPage }) => {
    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            <InstructorSidebar currentPage={currentPage} />
            <div className="flex-grow-1 p-3" style={{ marginLeft: '250px' }}>
                {children}
               
            </div>
        </div>
    );
};

export default InstructorLayout;
