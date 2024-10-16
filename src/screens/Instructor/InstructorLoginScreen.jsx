import {Link, useNavigate} from 'react-router-dom'
import { Form, Button  ,Row ,Col} from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import { useState , useEffect} from 'react'
import {useDispatch , useSelector} from 'react-redux'
import { useInstructorLoginMutation } from '../../slices/instructorApiSlice'
import { setCredentials } from '../../slices/instructorAuthslice'
import {toast} from 'react-toastify'
import Loader from '../../components/Loader'
import { FaEye, FaEyeSlash } from "react-icons/fa";


function InstructorLoginScreen() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const navigate = useNavigate();
    const dispatch = useDispatch();


  const [InstructorLogin,{isLoading}] = useInstructorLoginMutation();
  const instructorInfo = useSelector((state)=>state.instructorauth.instructorInfo)

useEffect(()=>{
  console.log(instructorInfo)
  if(instructorInfo){
    navigate('/instructor/Dashboard')
  }
},[navigate,instructorInfo])

    const submitHandler = async(e)=>{
        e.preventDefault();
        try {
         const res = await InstructorLogin({email,password}).unwrap();
            dispatch(setCredentials({...res}))
            
         toast.success('Login Successfully')
        } catch (error) {
          toast.error(error.data.message || error.error)
        }
    }
    


  return (
    <>
    
   <FormContainer>
   <h1 className='d-flex justify-content-center align-items-center pb-2' style={{fontFamily:'monospace'}}>Aspire</h1>
    <h2>Instructor Sign In</h2>
    <Form onSubmit={submitHandler}>
       <Form.Group className='my-2' controlId='email'>
        <Form.Label>Email Address</Form.Label>
        <Form.Control 
        type='email'
        placeholder='Enter Email' 
        value={email}
        onChange={(e)=>{setEmail(e.target.value)}}
        >
        </Form.Control>
       </Form.Group>

       <Form.Group className='my-2' controlId='password'>
        <Form.Label>Password</Form.Label>
        <div className="input-group">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
                style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              </div>
        
       </Form.Group>

    {isLoading && <Loader/>}

  <Button type='submit' variant='primary' className='mt-3'>
    Sign In
  </Button>

<Row className='py-3 '>
  <Col> New Instructor ? <Link to={'/instructor/register'}>Register</Link>
  </Col>
</Row>
    </Form>
   </FormContainer>
          </>
  )

}
export default InstructorLoginScreen
