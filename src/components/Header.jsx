import React, { useEffect, useRef, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, FormControl, Button, InputGroup } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation, useGetSuggestionsQuery } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { setSearchTerm } from '../slices/coursesSlice';

const Header = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const searchTerm = useSelector((state) => state.courses.searchTerm); // Redux search term
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const suggestionBoxRef = useRef(null);  
  const [logoutApiCall] = useLogoutMutation();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');  // Local state for input value
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');  // State to store debounced value

  const { data: suggestions = [] } = useGetSuggestionsQuery(debouncedSearchTerm, {
    skip: !debouncedSearchTerm.trim(),
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target)) {
        setSearchSuggestions([]);  // Hide suggestions
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [suggestionBoxRef]);

  // Debounce for suggestions, but no Redux dispatch
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(localSearchTerm);
    }, 300);  // Wait for 300ms before updating suggestions

    return () => {
      clearTimeout(handler);  // Clear timeout if user types within 300ms
    };
  }, [localSearchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedSearchTerm = localSearchTerm.trim();  // Trim whitespace from the search term
  
    if (trimmedSearchTerm) {
      // If there is a valid search term, dispatch and navigate
      dispatch(setSearchTerm(localSearchTerm)); // Dispatch the search term to Redux
      navigate(`/courses`);
    } else if (location.pathname === '/courses') {
      // If the search term is empty or whitespace and we are on the /courses page, clear the searchTerm in Redux
      dispatch(setSearchTerm(''));  // Clear the Redux searchTerm
    }
  };

  const handleSearchChange = (searchQuery) => {
    setLocalSearchTerm(searchQuery);  // Update local state as the user types
  };

  const handleClear = () => {
    setLocalSearchTerm('');  // Clear the local input
    dispatch(setSearchTerm(''));  // Clear the Redux search term
  };

  const handleSuggestionClick = (title) => {
    setLocalSearchTerm(title);  // Update local input value when suggestion is clicked
    setSearchSuggestions([]);
    dispatch(setSearchTerm(title));  // Dispatch the selected suggestion to Redux
    navigate(`/courses`);
  };

  const LogoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <header>
      <Navbar bg='light' variant='light' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand className='fs-2 px-auto'>Aspire</Navbar.Brand>
          </LinkContainer>
          <Form className="d-flex px-5" onSubmit={handleSearch}>
            <InputGroup>
              <FormControl
                type="search"
                placeholder="Search Courses"
                className="me-2"
                aria-label="Search"
                value={localSearchTerm}  // Controlled input tied to local state
                onChange={(e) => handleSearchChange(e.target.value)}  // Update local state on change
              />
              {localSearchTerm && (
                 <FaTimes
                 onClick={handleClear}
                 style={{
                   position: 'absolute',
                   right: '100px',
                   top: '50%',
                   transform: 'translateY(-50%)',
                   cursor: 'pointer',
                   color: '#888',
                 }}
               />
              )}
              <Button variant="outline-success" type="submit">Search</Button>
            </InputGroup>
            {suggestions.length > 0 && debouncedSearchTerm && (
              <div ref={suggestionBoxRef} style={{ position: 'absolute', top: '65px', border: '2px solid #ccc', minWidth: '225px', borderRadius: '8px', fontFamily: 'monospace' }} className='searchSuggestionContainer bg-light fw-bold'>
                <ul style={{ cursor: 'pointer', width: '100%' }} className='search-suggestions'>
                  {suggestions.map((course) => (
                    <div key={course._id}>
                      <div style={{ cursor: 'pointer' }} onClick={() => handleSuggestionClick(course.title)}>
                        {course.title}
                      </div>
                      <div style={{ width: '100%', backgroundColor: '#ccc', height: '1px' }}></div>
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </Form>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <LinkContainer to='/courses'>
                <Nav.Link>Courses</Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  {userInfo.courses && userInfo.courses.length > 0 && (
                    <LinkContainer to='/enrolled-courses'>
                      <Nav.Link>Enrolled Courses</Nav.Link>
                    </LinkContainer>
                  )}
                  <NavDropdown title={userInfo.name} id='username' style={{ zIndex: 9999 }}>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={LogoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to='/login'>
                    <Nav.Link>
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/register'>
                    <Nav.Link>
                      <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
