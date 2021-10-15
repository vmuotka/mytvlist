import React from 'react'
import { useSelector } from 'react-redux'

// project components
import ReviewCard from '../../components/ReviewCard'

const Reviews = ({ tv_id, data, title }) => {
    const user = useSelector(state => state.user)
    const decodedToken = user ? JSON.parse(window.atob(user.token.split('.')[1])) : undefined
    let filteredReviews = data
    if (decodedToken)
        filteredReviews = filteredReviews.filter(review => review.content && review.user.id !== decodedToken.id && review.content)
    else
        filteredReviews = filteredReviews.filter(review => review.content)
    return (
        <>
            <div className='mt-4'>
                {filteredReviews.length > 0 && <h2 className='text-xl text-gray-700'>Reviews ({filteredReviews.length})</h2>}
                <div className='flex flex-col gap-4 mt-4'>
                    {filteredReviews.filter(review => review.content).map(review =>
                        <ReviewCard key={review.id} review={review} />
                    )}
                </div>
            </div>
        </>
    )
}

export default Reviews