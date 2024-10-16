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
import { Form } from 'react-bootstrap';
import { useGetUserGrowthDataQuery } from '../slices/adminApiSlice'; // Import the RTK Query hook

// Helper function to get month name
const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1); // Subtract 1 because months are zero-indexed in JS
  return date.toLocaleString('default', { month: 'long' });
};

// Main User Growth Chart Component
const UserGrowthChart = () => {
  const [timeGranularity, setTimeGranularity] = useState('month'); // Default to 'month'

  // Use the RTK Query hook to fetch the data
  const { data: userGrowthData, error, isLoading } = useGetUserGrowthDataQuery(timeGranularity);

  // Format the data for Recharts
  const chartData = userGrowthData
    ? userGrowthData.map((entry) => {
        if (timeGranularity === 'day') {
          return {
            time: `${entry._id.day} ${getMonthName(entry._id.month)} ${entry._id.year}`, // Day label with month name
            totalUsers: entry.totalUsers,
          };
        } else if (timeGranularity === 'year') {
          return {
            time: `${entry._id.year}`, // Year label
            totalUsers: entry.totalUsers,
          };
        } else {
          return {
            time: `${getMonthName(entry._id.month)} ${entry._id.year}`, // Month label with full month name
            totalUsers: entry.totalUsers,
          };
        }
      })
    : [];

  return (
    <div>
      <h3>User Growth </h3>
      <Form.Group controlId="timeGranularitySelect" className="mb-3">
        <Form.Label>Select Time Granularity</Form.Label>
        <Form.Control
          as="select"
          value={timeGranularity}
          onChange={(e) => setTimeGranularity(e.target.value)}
        >
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </Form.Control>
      </Form.Group>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error fetching data</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalUsers" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default UserGrowthChart;
