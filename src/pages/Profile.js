import {getAuth, updateProfile} from 'firebase/auth'
import {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {updateDoc, doc, collection, query, where, orderBy, deleteDoc, getDocs } from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'
function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const {name, email} = formData
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserListings = async()=>{
      const listingRef = collection(db, 'listings')
      const q = query(listingRef, where('useRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))
      
      const querySnap = await getDocs(q)
      let listings = []
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings(listings)
      setLoading(false)
    }
    fetchUserListings()
  }, [ auth.currentUser.uid])

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }
  const onSubmit = async() => {
    try{
      if(auth.currentUser !== name){
        await updateProfile(auth.currentUser,{
          displayName: name
        })
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name
        })
      }
    }
    catch(err){
      toast.error("Could not update Profile Details")
    }
  }

  const onDelete = async(listingID) => {
    console.log(typeof listingID)
    try{
      if (window.confirm('Are you sure you want to delete?')) {
        const docRef = doc(db, 'listings', listingID)
        console.log(docRef)
         await deleteDoc(docRef)
        const updatedListings = listings.filter(
          (listing) => listing.id !== listingID
        )
        setListings(updatedListings)
        toast.success('Successfully deleted listing')
      }
    }catch(err){
      console.log(err)
    }
  }
  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

  const onChange = (e) => {
    setFormData ( (prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'> My Profile </p>
        <button type='button' className='logOut' onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p className='changePersonalDetails' onClick={() => {
            changeDetails && onSubmit()
            setChangeDetails((prevState) => !prevState)
          }}>
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>
        <div className='profileCard'>
          <form>
            <input
              type='text'
              id='name'
              className={changeDetails ? 'profileNameActive':'profileName'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
                type='text'
                id='name'
                className={changeDetails ? 'profileEmailActive':'profileEmail'}
                disabled={!changeDetails}
                value={email}
                onChange={onChange}
              />
          </form>
        </div>

        <Link to='/create-listing' className='createListing' >
          <img src={homeIcon} alt='home' />
          <p>Sale or rent your property</p>
          <img src={arrowRight} alt='arrowRight' />
        </Link>

        {!loading && listings?.length>0 && (
          <>
            <p className='listingText'> My Listings </p>
            <ul className='listingList' >
              {listings.map((listing) => (
                <ListingItem 
                  key={listing.id} 
                  listing={listing.data} 
                  id={listing.id} 
                  onDelete = {() => onDelete(listing.id)}
                  onEdit = {() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Profile