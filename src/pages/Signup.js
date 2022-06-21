import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {ReactComponent as VisibilityIcon} from '../assets/svg/visibilityIcon.svg'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {db} from '../firebase.config'
import {setDoc, doc, serverTimestamp} from 'firebase/firestore'
import OAuth from '../components/OAuth'
function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
        name:'',
        email: '',
        password: ''
  })
  const {name, email, password} = formData
  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    try{
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        updateProfile(auth.currentUser, {
            displayName: name,
        })

        const formDataCopy = {...formData}
        delete formDataCopy.password
        formDataCopy.timestamp = serverTimestamp()

        await setDoc(doc(db, 'users', user.uid), formDataCopy)

        navigate('/')
    }
    catch(err){
        toast.error('Something went wrong in registration')
    }
  }
  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>
          <form onSubmit={onSubmit}>
            <input type='text' 
                  className='nameInput' 
                  placeholder='name'
                  id='name'
                  value={name}
                  onChange={onChange}
            />
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
            <div className='signUpBar'>
              <p className='signUpText'>
                Sign Up
              </p>
              <button className='signUpButton'>
                <ArrowRightIcon fill='#ffffff' width='36px' height='36px'/>
              </button>
            </div>
          </form>
          <OAuth/>
          <Link to='/signin' className='registerLink'>
            SignIn instead !!
          </Link>

      </div>
    </>
  )
}

export default Signup