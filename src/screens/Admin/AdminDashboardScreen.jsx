import React  from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import AdminStats from '../../components/AdminStats.jsx';
import UserGrowthChart from '../../components/UserGrowthChart.jsx';
import RevenueGrowthChart from '../../components/RevenueGrowthChart.jsx';
import PurchasedCoursesPieChart from '../../components/PurchasedCoursesPieChart.jsx';

function AdminDashboardScreen() {
   
   

  return (
    <AdminLayout>

    <div >
    <h1 className="text-center">Admin Dashboard</h1>
       <AdminStats/>
       <UserGrowthChart/>
       <RevenueGrowthChart/>
       <PurchasedCoursesPieChart/>
    </div>
    
    </AdminLayout>
  );
}

export default AdminDashboardScreen;
