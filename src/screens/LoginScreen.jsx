import {Link , useNavigate} from 'react-router-dom'
import { Form, Button ,Row , Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useState , useEffect} from 'react'
import {useDispatch , useSelector} from 'react-redux'
import { useLoginMutation } from '../slices/userApiSlice'
import { setCredentials } from '../slices/authSlice'
import {toast} from 'react-toastify'
import Loader from '../components/Loader'
import Header from '../components/Header'
import { FaEye, FaEyeSlash } from "react-icons/fa";


function loginScreen() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login,{isLoading}] = useLoginMutation();
    const {userInfo} = useSelector((state)=>state.auth)

useEffect(()=>{
  if(userInfo){
    navigate('/')
  }
},[navigate,userInfo])

    const submitHandler = async(e)=>{
        e.preventDefault();
        try {
         const res = await login({email,password}).unwrap();
         dispatch(setCredentials({...res}))
         navigate('/')
         toast.success('Login Successfully')
        } catch (error) {
          toast.error(error.data.message || error.error)
        }
    }
    


  return (
    <>
     <Header/>
   <FormContainer>
    
    <h1>Sign In</h1>
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

<Row className='py-3'>
    <Col>
    New Customer ? <Link to='/register'>Register</Link>
    </Col>

    <Col>
    Are you an instructor ? <Link to='/instructor'>Sign In</Link>
    </Col>

</Row>
<p>Forgot password? <Link to='/forgot-password'>Click here</Link></p>

    </Form>
   </FormContainer>
          </>
  )

}
export default loginScreen
