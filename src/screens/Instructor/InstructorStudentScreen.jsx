import React from 'react'
import InstructorLayout from '../../components/InstructorLayout';

function InstructorStudentScreen() {
    return (
        <InstructorLayout currentPage="students">
            <h1 style={{display:"flex",justifyContent:"center"}}> Welcome to the Student page</h1>
        </InstructorLayout>
        );
}

export default InstructorStudentScreen
