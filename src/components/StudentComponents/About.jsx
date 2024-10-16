import React from 'react';
import { FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
const About = () => {
    return (
        <div className="container text-center my-5">
            <h2 className="mb-4" style={{ fontWeight: 'bold', fontSize: '2.5rem' , color:'#2F327D' }}>
                What is ASPIRE <span className='text-primary'>?</span>
            </h2>
            <p className="lead" style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#696984' }}>
                ASPIRE is a platform that allows educators to create online classes whereby they can 
                store the course materials online, manage quizzes, and conduct live classes. Students 
                can attend all of them, interact with instructors in real-time, and take part in quizzes.
            </p>
 {/* Two Cards Section */}
 <div className="row justify-content-center">
                {/* Instructor Card */}
                <div className="col-md-5 mb-4">
                    <div className="card h-100 shadow-sm" style={cardStyle}>
                        <div className="icon-container" style={iconContainerStyle}>
                            <FaChalkboardTeacher style={iconStyle} />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title" style={{ fontWeight: 'bold' }}>Be an Instructor</h5>
                            <p className="card-text">
                                Share your knowledge by creating courses, adding videos, and managing live classes. 
                                Start teaching and inspire students across the world.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Student Card */}
                <div className="col-md-5 mb-4">
                    <div className="card h-100 shadow-sm" style={cardStyle}>
                        <div className="icon-container" style={iconContainerStyle}>
                            <FaUserGraduate style={iconStyle} />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title" style={{ fontWeight: 'bold' }}>Be a Student</h5>
                            <p className="card-text">
                                Explore a variety of courses, attend live sessions, and take quizzes. 
                                Learn from expert instructors at your own pace.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Inline styles for the cards and icons
const cardStyle = {
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
};

const iconContainerStyle = {
    backgroundColor: '#e3f2fd', // Light blue background for the icon container
    padding: '20px',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    margin: '0 auto',
    marginTop: '10px', // Adjust to make icon overlap with card
};

const iconStyle = {
    color: '#2196f3', // Blue color for the icons
    fontSize: '2.5rem', // Icon size
};

export default About;
