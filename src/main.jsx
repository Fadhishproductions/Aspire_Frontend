import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter,createRoutesFromElements,Route,
        RouterProvider} from 'react-router-dom';
import store from './store.js';
import {Provider} from 'react-redux'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'  
import HomeScreen from './screens/Students/HomeScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'
import RegisterScreen from './screens/RegisterScreen.jsx'
import ProfileScreen from './screens/Students/ProfileScreen.jsx';
import Private from './components/Private.jsx';
import AdminDashboardScreen from './screens/Admin/AdminDashboardScreen.jsx';
import AdminLoginScreen from './screens/Admin/AdminLoginScreen.jsx';
import AdminPrivate from './components/AdminPrivate.jsx';
import InstructorLoginScreen from './screens/Instructor/InstructorLoginScreen.jsx';
import InstructorDashboardScreen from './screens/Instructor/InstructorDashboardScreen.jsx'; 
import InstructorCourseScreen from './screens/Instructor/InstructorCourseScreen.jsx'; 
import InstructorStudentScreen from './screens/Instructor/InstructorStudentScreen.jsx';
import InstructorProfileScreen from './screens/Instructor/InstructorProfileScreen.jsx';
import InstructorCreateCourseScreen from './screens/Instructor/InstructorCreateCourseScreen.jsx';
import CoursesScreen from './screens/CoursesScreen.jsx';
import InstructorPrivate from './components/InstructorPrivate.jsx';
import InstructorRegisterScreen from './screens/Instructor/InstructorRegisterScreen.jsx';
import AdminStudentScreen from './screens/Admin/AdminStudentScreen.jsx';
import AdminCategoryScreen from './screens/Admin/AdminCategoryScreen.jsx';
import AdminAddcategoryScreen from './screens/Admin/AdminAddcategoryScreen.jsx';
import AdminEditcategoryScreen from './screens/Admin/AdminEditcategoryScreen.jsx';
import InstructionCourseEditScreen from './screens/Instructor/InstructionCourseEditScreen.jsx';
import InstructorCourseDetailsScreen from './screens/Instructor/InstructorCourseDetailsScreen.jsx';
import CourseEnrollmentScreen from './screens/Students/CourseEnrollmentScreen.jsx'
import EnrolledCourses from './screens/Students/EnrolledCourses.jsx';
import CourseAttendingScreen from './screens/Students/CourseAttendingScreen.jsx';
import ForgotPassword from './screens/ForgotPassword.jsx';
import ResetPassword from './screens/ResetPassword.jsx';
import InstructorLiveScreen from './screens/Instructor/InstructorLiveScreen.jsx';
 import CourseLiveScreen from './screens/Students/CourseLiveScreen.jsx';
import SocketProvider from './context/SocketProvider.jsx';
import AdminRevenueScreen from './screens/Admin/AdminRevenueScreen.jsx';
import AdminCoursesScreen from './screens/Admin/AdminCoursesScreen.jsx';
import NotFoundScreen from './screens/NotFoundScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      {/* user routes */}
      <Route index={true}  path='/' element={<HomeScreen/>}/> 
      <Route  path='/login' element={<LoginScreen/>}/>
      <Route path='/register' element={<RegisterScreen/>}/>
      <Route path='/courses' element={<CoursesScreen/>}/>
      <Route path='/course/:id' element={<CourseEnrollmentScreen/>} />
      <Route path='/forgot-password' element={<ForgotPassword/>} />
      <Route path='/reset-password/:token' element={<ResetPassword/>} />
             {/*user Private Routes*/}
      <Route path='' element={<Private/>}>
        <Route path='/profile' element={<ProfileScreen/>}/>
        <Route path='/enrolled-courses' element={<EnrolledCourses/>}/>
        <Route path='/enrolled-courses/attend/:id' element={<CourseAttendingScreen/>}/>
        <Route path='/enrolled-courses/live/:courseId' element={<CourseLiveScreen/>} />
       </Route>


      {/*admin Routes  */}  
      <Route path='/admin' element={<AdminLoginScreen/>} />
               {/* admin private routes */}
        <Route path='' element={<AdminPrivate/>}>
          <Route path='/admin/Dashboard' element={<AdminDashboardScreen/>} />
          <Route path='/admin/students' element={<AdminStudentScreen/>} />
          <Route path='/admin/categories'element={<AdminCategoryScreen/>} />
          <Route path='/admin/categories/create' element={<AdminAddcategoryScreen/> }  />
          <Route path='/admin/categories/edit' element={<AdminEditcategoryScreen/>} />
          <Route path='/admin/revenue' element={<AdminRevenueScreen/>}/>
          <Route path='/admin/courses' element={<AdminCoursesScreen/>} />
        </Route>

        {/* instructor Routes */}
        <Route path='/instructor' element={<InstructorLoginScreen/>} />
        <Route path='/instructor/register' element={<InstructorRegisterScreen/>} />
          <Route path='' element={<InstructorPrivate/>}>
              <Route path='/instructor/dashboard' element={<InstructorDashboardScreen/>} />
              <Route path='/instructor/courses' element={<InstructorCourseScreen/>} />
              <Route path='/instructor/students' element={<InstructorStudentScreen/>} />
              <Route path='/instructor/profile' element={<InstructorProfileScreen/>} />
              <Route path='/instructor/course/create' element={<InstructorCreateCourseScreen/>}  />
              <Route path='/instructor/course/edit'  element={<InstructionCourseEditScreen/>} />
              <Route path='/instructor/course/details' element={<InstructorCourseDetailsScreen/>} />
              <Route path='/instructor/course/live/:courseId' element={<InstructorLiveScreen/>} />
          </Route>
          <Route path='*' element={<NotFoundScreen />} />
    </Route>  
  )
) 

ReactDOM.createRoot(document.getElementById('root')).render(
<Provider store={store}>  
  <SocketProvider>
   {/* <React.StrictMode> */}
   <RouterProvider router={router}/>
  {/* </React.StrictMode>, */}
  </SocketProvider>
 </Provider>
)
