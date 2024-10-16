import React from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import { Spinner, Alert, Container } from 'react-bootstrap';
import { useGetPurchasedCoursesQuery } from '../../slices/instructorApiSlice';
 
// Colors for the pie chart segments
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF5733', '#33FF57'];

const PurchasedCoursesPieChart = () => {
  const { data: purchasedCourses, error, isLoading } = useGetPurchasedCoursesQuery();

  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading purchased courses data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error fetching purchased courses data. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center">Purchased Courses Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={purchasedCourses || []}
            dataKey="purchases"
            nameKey="courseName"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {purchasedCourses?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default PurchasedCoursesPieChart;
