import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import { useGetCategoriesPaginatedQuery, useToggleCategoryPublishMutation } from '../../slices/adminApiSlice.js';
import { Button, Table, Form, Pagination, Alert } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader.jsx';
import { toast } from 'react-toastify';

function AdminCategoryScreen() {
  const navigate = useNavigate();

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;  // Adjust the number of categories per page

  // State to manage categories
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch categories from the server using RTK Query with page, limit, and search parameters
  const { data, isLoading, isError, error, refetch } = useGetCategoriesPaginatedQuery({
    page: currentPage,
    limit: categoriesPerPage,
    search: searchTerm,
  });

   useEffect(() => {
    if (data && data.categories) {
      
      setCategories(data.categories);  
      setTotalPages(data.totalPages || 1);  
    } else {
      setCategories([]);  
    }
  }, [data]);

  const [toggleCategoryPublish] = useToggleCategoryPublishMutation();

  const handleToggle = async (categoryId) => {
    try {
      await toggleCategoryPublish(categoryId).unwrap();
      toast.success('Category publish status toggled!');
      refetch();  // Refetch categories after toggling publish status
    } catch (error) {
      toast.error('Failed to toggle publish status');
      console.error('Failed to toggle publish status', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);  // Reset to the first page when searching
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h1 className="admin-dashboard-header">Category List</h1>

        <div className="mb-3 d-flex justify-content-between">
          <Button onClick={() => navigate('/admin/categories/create')} variant="primary">
            Add Category
          </Button>

          {/* Search Form */}
          <Form className="d-flex">
            <Form.Control
              type="text"
              placeholder="Search Categories"
              className="me-2"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </div>

        {/* Loader and Error handling */}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Alert variant="danger">
            Error fetching categories: {error?.data?.message || 'An error occurred'}
          </Alert>
        ) : categories.length === 0 ? (
          <Alert variant="info">No categories found.</Alert>
        ) : (
          <>
            {/* Responsive Table */}
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Edit</th>
                    <th>Status</th>
                    <th>Publish/Draft</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((category) => (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td className="text-center align-middle">
                        <Button 
                          variant="warning" 
                          onClick={() => navigate(`/admin/categories/edit?id=${category._id}`)}
                        >
                          Edit
                        </Button>
                      </td>
                      <td className="text-center align-middle">
                        {category.isPublished ? 'Published' : 'Draft'}
                      </td>
                      <td className="text-center align-middle">
                        <Button 
                          onClick={() => handleToggle(category._id)}
                          variant={category.isPublished ? 'danger' : 'success'}
                        >
                          {category.isPublished ? 'Draft' : 'Publish'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="d-flex justify-content-center">
                {[...Array(totalPages).keys()].map((number) => (
                  <Pagination.Item
                    key={number + 1}
                    active={number + 1 === currentPage}
                    onClick={() => paginate(number + 1)}
                  >
                    {number + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminCategoryScreen;
