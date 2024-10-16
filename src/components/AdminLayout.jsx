import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            <AdminSidebar />
            <div className="flex-grow-1 p-3" style={{ marginLeft: '250px' }}>
                {children}
               
            </div>
        </div>
    );
};

export default AdminLayout;
