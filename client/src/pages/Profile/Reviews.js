import React from 'react'

import ReviewCard from '../../components/ReviewCard'

const Reviews = ({ reviews }) => {
    return (
        <>
            {
                reviews.length > 0 ?
                    <>
                        <span className='text-gray-700 text-xl my-2 block'>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
                        <div className='flex flex-col gap-4'>
                            {reviews.map(review =>
                                <ReviewCard key={review.id} review={review} />
                            )}
                        </div>
                    </>
                    :
                    <div className='text-gray-700'>This user has not left any reviews yet.</div>
            }
        </>
    )
}

export default Reviews