import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
function Offers() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading]  = useState(true)
    const params = useParams()
    const [lastFetchedListing, setLastFetchedListing] = useState(null)
    useEffect(() => {
        const fetchListings = async() => {
            try {
                const listingsRef = collection( db, 'listings' )
                const q = query(listingsRef, 
                    where('offer', '==', true),
                    orderBy('timestamp', 'desc'),
                    limit(1))
                const querySnap = await getDocs(q)
                let listings = []
                querySnap.forEach((doc) => {
                    listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                const lastVisible = querySnap.docs[querySnap.docs.length-1]
                setLastFetchedListing(lastVisible)
                setListings(listings)
                setLoading(false)
             } catch (error) {
                toast.error('Could Not Found Any Offers')
            }
        }
        fetchListings()
    }, [params.categoryName])
    const onFetchMoreListing = async() => {
        try {
            const listingsRef = collection( db, 'listings' )
            const q = query(listingsRef, 
                where('offer', '==', true),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedListing),
                limit(1))
            const querySnap = await getDocs(q)
            console.log(querySnap.docs)
            const lastVisible = querySnap.docs[querySnap.docs.length-1]
            setLastFetchedListing(lastVisible)
            let listings = []
            querySnap.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)
         } catch (error) {
            toast.error('Could Not Found Fetch Listings')
        }
    }
   return (
    <div className='category' >
        <header>
            <p className='pageHeader' >
              Offers
            </p>
        </header>
        {loading ? 
            <Spinner /> : 
            listings && listings.length>0 ? 
                (<>
                    <main>
                        <ul className='categoryListings' >
                            {listings.map((listing) => (
                                <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
                            ))}
                        </ul>    
                    </main>
                    <br/><br/>
                    {lastFetchedListing && (
                        <p className='loadMore' onClick={onFetchMoreListing} >load more</p>
                    )}
                </>) : 
                (<p> There are no current offers </p>)
        }
    </div>
  )
}

export default Offers