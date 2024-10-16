import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Form, Spinner, Alert } from 'react-bootstrap';
import { useGetRevenueGrowthQuery } from '../slices/adminApiSlice';
 
// Helper function to get month name
const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1); // Subtract 1 because months are zero-indexed in JS
  return date.toLocaleString('default', { month: 'long' });
};

const RevenueGrowthChart = () => {
  const [timeGranularity, setTimeGranularity] = useState('month'); // Default to 'month'

  // Fetch the data from the API based on selected granularity
  const { data, error, isLoading } = useGetRevenueGrowthQuery(timeGranularity);

  // Format the data for Recharts, calculating the admin's revenue (10% of total revenue)
  const formattedData = data?.map((entry) => {
    const adminRevenue = entry.totalRevenue * 0.10; // Calculate 10% of total revenue for admin

    if (timeGranularity === 'day') {
      return {
        time: `${entry._id.day} ${getMonthName(entry._id.month)} ${entry._id.year}`,
        totalRevenue: adminRevenue, // Only showing the admin's 10%
      };
    } else if (timeGranularity === 'year') {
      return {
        time: `${entry._id.year}`,
        totalRevenue: adminRevenue, // Only showing the admin's 10%
      };
    } else {
      return {
        time: `${getMonthName(entry._id.month)} ${entry._id.year}`,
        totalRevenue: adminRevenue, // Only showing the admin's 10%
      };
    }
  });

  // Handle the filter selection change
  const handleFilterChange = (e) => {
    setTimeGranularity(e.target.value);
  };

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Error fetching data</Alert>;

  return (
    <div>
      <h3>Admin Revenue Growth </h3>
      <Form.Group controlId="timeGranularitySelect" className="mb-3">
        <Form.Label>Select Time Granularity</Form.Label>
        <Form.Control
          as="select"
          value={timeGranularity}
          onChange={handleFilterChange}
        >
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </Form.Control>
      </Form.Group>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueGrowthChart;