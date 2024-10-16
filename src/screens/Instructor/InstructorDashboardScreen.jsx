import React from 'react';
import InstructorLayout from '../../components/InstructorLayout';
import InstructorStats from '../../components/InstructorComponents/InstructorStats';
import InstructorEarningsBreakdown from '../../components/InstructorComponents/InstructorEarningsBreakdown';
import PurchasedCoursesPieChart from '../../components/InstructorComponents/PurchasedCoursesPieChart';
function InstructorDashboardScreen() {
  return (

   <InstructorLayout currentPage={"dashboard"}>
     <h1 className='text-center'> Instructor Dashboard</h1>

     <InstructorStats/>
     <InstructorEarningsBreakdown/>
     <PurchasedCoursesPieChart/>

   </InstructorLayout>
    );
} 

export default InstructorDashboardScreen;
   