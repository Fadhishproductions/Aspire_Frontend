import React, { useState, useEffect } from 'react';
import { Container, Table, Row, Col, Spinner, Alert, Form, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useGetRevenueAnalysisQuery } from '../slices/adminApiSlice';
import moment from 'moment'; // For formatting dates

const AdminRevenueAnalysisTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // For debouncing
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  // Debounce effect for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm); // Update the debounced search term after 500ms
    }, 500);

    // Cleanup timeout if the effect is called again (user is still typing)
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch data with the debounced search term
  const { data, isLoading, isError, refetch } = useGetRevenueAnalysisQuery({
    search: debouncedSearchTerm, // Use debounced search term for API call
    page: currentPage,
    limit: itemsPerPage,
  });

  // Extract data from response
  const revenueData = data?.revenueAnalysis || [];
  const totalPages = data?.totalPages || 1;
  const totalAdminRevenue = revenueData?.reduce((sum, course) => sum + course.totalAdminRevenue, 0);

  useEffect(() => {
    refetch(); // Fetch data whenever search term or page changes
  }, [debouncedSearchTerm, currentPage, refetch]);

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Loading state
  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading revenue data...</p>
      </Container>
    );
  }

  // Error state
  if (isError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Error fetching revenue data. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Revenue Analysis</h2>
        </Col>
      </Row>

      {/* Display total admin revenue */}
      <Row className="mb-4">
        <Col>
          <h4>Total Admin Revenue: ₹{totalAdminRevenue?.toLocaleString()}</h4>
        </Col>
      </Row>

      {/* Search input */}
      <Row className="mb-4">
        <Col md={6} className="mx-auto">
          <Form.Control
            type="text"
            placeholder="Search by course or instructor"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Update search term as user types
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          {/* If no data is available, show a message */}
          {revenueData.length === 0 ? (
            <Alert variant="info" className="text-center">
              No data available.
            </Alert>
          ) : (
            <>
              <Table striped bordered hover responsive centered>
                <thead className="thead-dark">
                  <tr>
                    <th>Course Name</th>
                    <th>Instructor Name</th>
                    <th>Total Instructor Revenue</th>
                    <th>Total Admin Revenue</th>
                    <th>Last Transaction Date</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData.map((course) => (
                    <tr key={course.courseName}>
                      <td>{course.courseName}</td>
                      <td>{course.instructorName}</td>
                      <td>₹{course.totalInstructorRevenue.toLocaleString()}</td>
                      <td>₹{course.totalAdminRevenue.toLocaleString()}</td>
                      <td>{moment(course.lastTransactionDate).format('MMMM Do YYYY, h:mm:ss a')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <Pagination className="d-flex justify-content-center mt-4">
                {[...Array(totalPages).keys()].map((x) => (
                  <Pagination.Item
                    key={x + 1}
                    active={x + 1 === currentPage}
                    onClick={() => handlePageChange(x + 1)}
                  >
                    {x + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminRevenueAnalysisTable;
