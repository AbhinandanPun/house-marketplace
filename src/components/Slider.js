import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore'
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import {db} from '../firebase.config'
import Spinner from '../components/Spinner'
import rupee from '../assets/jpg/rupee.png'
function Slider() {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    useEffect(() => {
        const fetchListings = async() =>{
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
            const querySnap = await getDocs(q);
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
        fetchListings()
    }, []) 
    if(loading) return <Spinner/>
    if(listings.length === 0) return <></>
  return (
    <>
        <p className='exploreHeading' >
            Recommended
        </p>
        
        <AliceCarousel autoPlay autoPlayInterval="3000">
            {listings.map(({data, id}) => (
                <Link key={id} to={`/category/${data.type}/${id}`}>
                    <div style={{background: `url(${data.imgUrls[0]}) center no-repeat`, 
                                backgroundSize:'cover',
                                 width: '100%',
                                 height: '200px',}}>
                        <p className='swiperSlideText' >{data.name}</p>
                        <p className='swiperSlidePrice' >
                        <img style={{width:"12px", height:"12px",}} src={rupee}  alt='rupee' />{data.discountedPrice ?? data.regularPrice}
                        {data.type === 'rent' && ' / month'}
                        </p>
                    </div>
                    <></>
                </Link>
                
            ))}
        </AliceCarousel>
    </>
  )
}

export default Slider