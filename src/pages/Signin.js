import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {ReactComponent as VisibilityIcon} from '../assets/svg/visibilityIcon.svg'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import OAuth from '../components/OAuth'
function Signin() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
        email: '',
        password: ''
  })
  const {email, password} = formData
  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onSubmit = async(e) => {
    e.preventDefault()
    try{
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      if(userCredential.user){
        navigate('/')
      }
    }
    catch(err){
      toast.error('Bad User Credentials')
    }
  }
  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>
          <form onSubmit={onSubmit}>
            <input type='email' 
                  className='emailInput' 
                  placeholder='email'
                  id='email'
                  value={email}
                  onChange={onChange}
            />
            <div className='passwordInputDiv'>
              <input type={showPassword ? 'text' : 'password'} 
                    className='passwordInput' 
                    placeholder='password'
                    id='password'
                    value={password}
                    onChange={onChange}
              />
              
              <button className='showPassword' onClick = { (e) => {
                e.preventDefault()
                setShowPassword((prevState) => !prevState)
              }}>
                <VisibilityIcon fill='#000000' width='15px' height='15px'/>
              </button>
            </div>
            <Link to='/forgot-password' className='forgotPasswordLink'>
              Forgot Password
            </Link>
            <div className='signInBar'>
              <p className='signInText'>
                Sign In
              </p>
              <button className='signInButton'>
                <ArrowRightIcon fill='#ffffff' width='36px' height='36px'/>
              </button>
            </div>
          </form>
          <OAuth/>
          <Link to='/signup' className='registerLink'>
            SignUp instead !!
          </Link>

      </div>
    </>
  )
}

export default Signin