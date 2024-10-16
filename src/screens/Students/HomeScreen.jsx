import React, { useEffect } from 'react'
 import Banner from '../../components/StudentComponents/Banner'
import About from '../../components/StudentComponents/About'
import Features from '../../components/StudentComponents/Features'
 import StudentLayout from '../../components/StudentComponents/StudentLayout'
const HomeScreen = () => {
 
  return (
    <>
 <StudentLayout> 
     <Banner/>
     <About/>
     <Features/>  
 </StudentLayout>
    </>
  )
}

export default HomeScreen
