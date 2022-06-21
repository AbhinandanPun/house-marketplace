import {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import {getDoc, doc} from 'firebase/firestore'
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import {getAuth} from 'firebase/auth'
import {db} from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import rupee from '../assets/jpg/rupee.png'
import rupeeb from '../assets/jpg/rupee-b.png'
function Listing() {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)
    const params = useParams()
    const auth = getAuth()

    useEffect (() => {
        const fetchListing = async() => {
            const docRef = doc(db, 'listings', params.listingID)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists){
                setListing(docSnap.data())
                setLoading(false)
            }
        }
        fetchListing()
    }, [params.listingID])
    if(loading) return <Spinner />
  return (
    <main>
        <AliceCarousel autoPlay autoPlayInterval="3000">
            {listing.imgUrls.map((url, index) => (
                <img className='slider' src={listing.imgUrls[index]} alt={index} key={index} />
            ))}
        </AliceCarousel>
        <div className='shareIconDiv' onClick = { () => {
            navigator.clipboard.writeText(window.location.href)
            setShareLinkCopied(true)
            setTimeout(() => {
                setShareLinkCopied(false)
            }, 2000)
        }} >
            <img src={shareIcon} alt='' />
        </div>
        {shareLinkCopied && <p className='linkCopied' >Link Copied</p>}

        <div className='listingDetails' >
            <p className='listingName' > 
                {listing.name} - <img style={{width:"15px", height:"15px",}} src={rupee}  alt='rupee' />
                {listing.offer 
                    ? listing.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : listing.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
            </p>
            <p className='listingLocation' > {listing.location}</p>
            <p className='listingType' >
                For {listing.type === 'rent' ? 'Rent' : 'Sale'}
            </p>
            {listing.offer && (
                <p className='discountPrice' >
                   <img style={{paddingTop:"1px", width:"12px", height:"12px",}} src={rupeeb}  alt='rupee' /> {listing.regularPrice - listing.discountedPrice} discount
                </p>
            )}

            <ul className='listingDetailsList' >
                <li>
                    {listing.bedrooms > 1 
                        ? `${listing.bedrooms} Bedrooms`
                        : '1 Bedroom' 
                    }
                </li>
                <li>
                    {listing.bathrooms > 1 
                        ? `${listing.bathrooms} Bathrooms`
                        : '1 Bathroom' 
                    }
                </li>
                <li>
                    {listing.parking && 'Parking Spot'}
                </li>
                <li>
                    {listing.furnished && 'Furnished'}
                </li>
            </ul>

            <p className='listingLocationTitle' >Location</p>
            <div className='leafletContainer' >
                <MapContainer style={{height:'100%', width:'100%'}}
                    center={[listing.geolocation.lat, listing.geolocation.lng]}
                    zoom={5}
                    scrollWheelZoom={false} >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                    />

                    <Marker
                        position={[listing.geolocation.lat, listing.geolocation.lng]}
                    >
                        <Popup>{listing.location}</Popup> 
                    </Marker>
                </MapContainer>
               

            
            </div>

            {auth?.currentUser?.uid !== listing.useRef && (
                <Link to={`/contact/${listing.useRef}?listingName=${listing.name}`} 
                      className='primaryButton'
                >
                    Contact Landlord
                </Link>
            )}
        </div>
    </main>
  )
}

export default Listing