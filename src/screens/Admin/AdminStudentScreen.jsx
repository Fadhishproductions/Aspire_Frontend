import React, { useEffect, useState } from 'react';
import { useGetAllUserMutation, useBlockUserMutation } from '../../slices/adminApiSlice.js';
import '../../css/AdminDashboardScreen.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout.jsx';
import { Table, Button, Pagination, Alert } from 'react-bootstrap';

function AdminStudentScreen() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(''); // For debouncing
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [limit] = useState(10); // Results per page
  const [getalluser, { isLoading }] = useGetAllUserMutation();
  const [blockUser] = useBlockUserMutation();
  const navigate = useNavigate();

  // Debouncing effect for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery); // Update the debounced query after 500ms
    }, 500);

    // Cleanup the timeout if the effect is called again before 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    getUsers();
  }, [debouncedSearchQuery, page]);

  const getUsers = async () => {
    try {
      const res = await getalluser({ searchQuery: debouncedSearchQuery, page, limit }).unwrap();
      setUsers(res.users); // Assuming the response has 'users' and 'totalPages'
      setTotalPages(res.totalPages); // Total pages from the server
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query as the user types
    setPage(1); // Reset to the first page when searching
  };

  const handleBlockClick = async (userId) => {
    try {
      await blockUser({ userId }).unwrap();
      toast.success("User's block status updated successfully");

      // Update the user state directly
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
    } catch (error) {
      toast.error(error.msg || 'Failed to update block status');
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="admin-dashboard-header">Users List</h1>
        <div className="flex items-center justify-center mx-3">
          <input
            type="text"
            placeholder="Search users..."
            onChange={handleSearchChange}
            value={searchQuery}
            className="admin-dashboard-input"
          />
        </div>

        {users.length > 0 ? (
          <>
            <Table>
              <thead>
                <tr>
                  <th className="admin-dashboard-item">S.No</th>
                  <th className="admin-dashboard-item">Name</th>
                  <th className="admin-dashboard-item">Email</th>
                  <th className="admin-dashboard-item">Role</th>
                  <th>Status</th>
                  <th className="admin-dashboard-item">Block</th>
                  <th className="admin-dashboard-item mr-3">Image</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td className="admin-dashboard-item">{(page - 1) * limit + index + 1}</td>
                    <td className="admin-dashboard-item">{user.name}</td>
                    <td className="admin-dashboard-item">{user.email}</td>
                    <td className="admin-dashboard-item">{user.role}</td>
                    <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                    <td>
                      <Button onClick={() => handleBlockClick(user._id)} className="p-2" type="block">
                        {user.isBlocked ? 'Active' : 'Block'}
                      </Button>
                    </td>
                    <td>
                      <img
                        className="admin-dashboard-img"
                        src={user.imageUrl}
                        alt=""
                        style={{ objectFit: 'cover', borderRadius: '10%', backgroundColor: 'grey' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination UI */}
            <Pagination className="d-flex justify-content-center">
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === page}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        ) : (
          <Alert variant="info" className="text-center">
            No students or instructors available.
          </Alert>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminStudentScreen;
