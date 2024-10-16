import { Navbar, Nav, Container, NavDropdown , Badge } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import { useAdminLogoutMutation } from '../slices/adminApiSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/adminAuthSlice';
const AdminHeader = () => {
  const AdminInfo = useSelector((state)=>state.adminauth.AdminInfo)
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  const [logoutApiCall] = useAdminLogoutMutation()
 
const LogoutHandler = async()=>{
  try {
    await logoutApiCall().unwrap();
    dispatch(logout());
    navigate('/admin')
  } catch (error) {
    console.log(error)
  }
}

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/' >
          <Navbar.Brand >ADMIN PANEL - Aspire </Navbar.Brand> 
          </LinkContainer>
         
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
                {AdminInfo ? (
                 <>
                 <NavDropdown title={AdminInfo.name} id='username'> 
                     <NavDropdown.Item onClick={LogoutHandler}>
                          Logout
                      </NavDropdown.Item>
                 </NavDropdown>
                 </>

                ):""}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default AdminHeader;