import React, { useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import { Form, Spinner, Alert } from 'react-bootstrap';
import { useGetPurchasedCoursesAllTimeQuery , useGetPurchasedCoursesCurrentMonthQuery } from '../slices/adminApiSlice';
 
// Colors for each course in the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const PurchasedCoursesByMonth = () => {
  const [filter, setFilter] = useState('currentMonth'); // Default filter is current month

  // Fetch data based on the selected filter
  const { data: allTimeData, isLoading: allTimeLoading, error: allTimeError } = useGetPurchasedCoursesAllTimeQuery();
  const { data: currentMonthData, isLoading: currentMonthLoading, error: currentMonthError } = useGetPurchasedCoursesCurrentMonthQuery();

  // Choose the correct data to display
  const data = filter === 'all' ? allTimeData : currentMonthData;
  const loading = filter === 'all' ? allTimeLoading : currentMonthLoading;
  const error = filter === 'all' ? allTimeError : currentMonthError;

  // Handle the filter selection change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  if (loading) return <Spinner animation="border" />;

  if (error) return <Alert variant="danger">Error: {error.message}</Alert>;

  return (
    <div>
      <h3>Course Sales</h3>
      
      <Form.Group controlId="filterSelect" className="mb-3">
        <Form.Label>Select Time Range</Form.Label>
        <Form.Control as="select" value={filter} onChange={handleFilterChange}>
          <option value="currentMonth">Current Month</option>
          <option value="all">All Time</option>
        </Form.Control>
      </Form.Group>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data || []}
            dataKey="purchases"
            nameKey="courseName"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {data && data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PurchasedCoursesByMonth;
