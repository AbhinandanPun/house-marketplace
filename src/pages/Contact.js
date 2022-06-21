import {useState, useEffect} from 'react'
import {useSearchParams, useParams} from 'react-router-dom'
import {getDoc, doc} from 'firebase/firestore'
import {toast}  from 'react-toastify'
import {db} from '../firebase.config'
function Contact() {
    const [message, setMessage] = useState('')
    const [landlord, setLandlord] = useState(null)
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams()
    const params = useParams()
    useEffect (() => {
        const getLandlord = async() => {
            const docRef = doc(db, 'users', params.landlordID)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists){
                setLandlord(docSnap.data())
            }
            else{
                toast.error('Could not get landlord data')
            }
        }
        getLandlord()
    }, [params.landlordID])

    const onChange = e => setMessage(e.target.value)
  return (
    <div className='pageContainer' >
        <header>
            <p className='pageHeader' > Contact Landlord </p>
        </header>
        {landlord && (
            <main>
                <div className='contactLandlord' >
                    <p className='landlordName' >Contact {landlord?.name}</p>
                </div>
                <form className='messageForm' >
                    <div className='messageDiv' >
                        <label htmlFor='message' className='messageLabel' >
                            Message
                        </label>
                        <textarea 
                            name='message' 
                            id='message' 
                            className='textarea' 
                            value={message} 
                            onChange={onChange} 
                        >
                        </textarea>
                    </div>
                    <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`} >
                        <button className='primaryButton' type='button'>
                            Send Message
                        </button>
                    </a>
                </form>
            </main>
        )}
    </ div>
  )
}

export default Contact