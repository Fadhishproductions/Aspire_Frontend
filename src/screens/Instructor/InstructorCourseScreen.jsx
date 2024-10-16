import React, { useEffect, useState } from 'react';
import InstructorLayout from '../../components/InstructorLayout.jsx';
import { useInstructorgetallCourseMutation } from '../../slices/instructorApiSlice.js';
import { toast } from 'react-toastify';
import { Table, Button } from 'react-bootstrap';
import { useTogglePublishCourseMutation } from '../../slices/instructorApiSlice.js';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function InstructorCourseScreen() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [getallCourses] = useInstructorgetallCourseMutation();
    const [publishCourse] = useTogglePublishCourseMutation();
    const instructorInfo = useSelector((state) => state.instructorauth.instructorInfo);
    const navigate = useNavigate();

    useEffect(() => {
        if (instructorInfo) {
            getCourses();
        }
    }, [instructorInfo]);

    const getCourses = async () => {
        try {
            const res = await getallCourses({ id: instructorInfo._id }).unwrap();
            setCourses([...res]);
            setFilteredCourses([...res]);
            console.log('Courses loaded:', res);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleTogglePublish = async (courseId) => {
        try {
            const updatedCourse = await publishCourse({ id: courseId }).unwrap();
            setCourses(courses.map(course =>
                course._id === courseId ? { ...course, published: updatedCourse.published } : course
            ));
            setFilteredCourses(filteredCourses.map(course =>
                course._id === courseId ? { ...course, published: updatedCourse.published } : course
            ));
            toast.success('Course status updated');
        } catch (error) {
            toast.error('Failed to update course status');
        }
    };

    const handleSearchChange = (e) => {
        
        const query = e.target.value.toLowerCase().trim();
        
        
        const pattern = new RegExp(query.replace(/\s+/g, ''), 'i'); // 'i' for case-insensitive search
    
        setSearchQuery(query);
       
        const filtered = courses.filter(course => {

            const title = course.title.toLowerCase().replace(/\s+/g, '');
            const description = course.description.toLowerCase().replace(/\s+/g, '');
            const instructorName = course.instructor.name.toLowerCase().replace(/\s+/g, '');
            const categoryName = course.category.name.toLowerCase().replace(/\s+/g, '');
            const level = course.level.toLowerCase().replace(/\s+/g, '');
            const price = course.price.toString().replace(/\s+/g, '');
            
          
            return (
                pattern.test(title) ||
                pattern.test(description) ||
                pattern.test(instructorName) ||
                pattern.test(categoryName) ||
                pattern.test(level) ||
                pattern.test(price)
            );
        });
        
        
        setFilteredCourses(filtered);
    };
    

    return (
        <InstructorLayout currentPage="courses">
            <h1 className="admin-dashboard-header">Course List</h1>
            <div className="flex items-center justify-center mx-3">
                <input
                    type="text"
                    placeholder="Search Courses..."
                    onChange={handleSearchChange}
                    value={searchQuery}
                    className="admin-dashboard-input"
                />
            </div>

            <div className="p-3">
                <button
                    onClick={() => { navigate('/instructor/course/create') }}
                    className="admin-dashboard-button"
                >
                    Create Course
                </button>
            </div>

            <Table striped bordered hover className='mb-3'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th> 
                        <th>Category</th>
                        <th>Level</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Edit</th>
                        <th>publish/draft</th><th>More details</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCourses.map(course => (
                        <tr key={course._id}>
                            <td>{course.title}</td>
                            <td>{course.description}</td> 
                            <td>{course.category.name}</td>
                            <td>{course.level}</td>
                            <td>{course.price}</td>
                            <td className={`${course.published ? 'text-success' : 'text-danger'} fw-bold`}>
                                {course.published ? "Published" : "Draft"}
                            </td>
                            <td>
                                <Button className='ml-1 mr-1' onClick={()=>{navigate(`/instructor/course/edit?id=${course._id}`)}}>
                                    Edit
                                </Button></td>
                                <td>
                                <Button
                                    variant={course.published ? 'warning' : 'success'}
                                    onClick={() => handleTogglePublish(course._id)}
                                >
                                    {course.published ? 'Draft' : 'Publish'}
                                </Button>
                            </td>
                            <td><Button onClick={()=>{navigate(`/instructor/course/details?id=${course._id}`)}}>Details</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </InstructorLayout>
    );
}

export default InstructorCourseScreen;
