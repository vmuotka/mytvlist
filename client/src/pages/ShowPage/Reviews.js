import React from 'react'

// project components
import ReviewForm from '../../components/ReviewForm'
import ReviewCard from '../../components/ReviewCard'
import { useAuth } from '../../context/auth'

const Reviews = ({ tv_id, data, title }) => {
    const { authTokens } = useAuth()
    const decodedToken = authTokens ? JSON.parse(window.atob(authTokens.token.split('.')[1])) : undefined
    let filteredReviews = data
    if (decodedToken)
        filteredReviews = filteredReviews.filter(review => review.content && review.user.id !== decodedToken.id && review.content)
    else
        filteredReviews = filteredReviews.filter(review => review.content)
    return (
        <>
            {decodedToken && <ReviewForm title={title} tv_id={tv_id} review={data.find(review => review.user.id === decodedToken.id)} />}
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