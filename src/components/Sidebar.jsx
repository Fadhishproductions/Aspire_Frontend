import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters } from '../slices/coursesSlice';
import { useGetcategoriesMutation } from '../slices/userApiSlice';

const Sidebar = () => {
   const dispatch = useDispatch();
  const filter = useSelector((state) => state.courses.filter);
  const [categories, setCategories] = useState([]);
   const [getCategories] = useGetcategoriesMutation();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();
      console.log(response)
      setCategories(response.data);
    };
    fetchCategories();
  }, [getCategories]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilter({ [name]: value }));
  };

  
  return (
    <div className="sidebar mt-2">
      <Form>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control as="select" name="category" value={filter.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="level">
          <Form.Label>Level</Form.Label>
          <Form.Control as="select" name="level" value={filter.level} onChange={handleFilterChange}>
            <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
              <option value="Professional-certification">Professional/Certification</option>
              <option value="Refresher">Refresher</option>
 
           </Form.Control>
        </Form.Group>

        <Form.Group controlId="sort">
          <Form.Label>Sort By</Form.Label>
          <Form.Control as="select" name="sort" value={filter.sort} onChange={handleFilterChange}>
            <option value="">None</option>
            <option value="recentCourses">Recent (New to Old)</option>
            <option value="nameAsc">Name (A to Z)</option>
            <option value="nameDesc">Name (Z to A)</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" className='mt-2' onClick={() => dispatch(clearFilters())}>Clear Filters</Button>
      </Form>
    </div>
  );
};

export default Sidebar;
