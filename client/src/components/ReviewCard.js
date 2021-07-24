import React, { useState } from 'react'
import { Link } from 'react-router-dom'

// project components
import ThumbDown from './icons/ThumbDown'
import ThumbUp from './icons/ThumbUp'

const Spoiler = ({ review }) => {
    const [showSpoiler, setShowSpoiler] = useState(!review.spoilers)
    return (
        <>
            {!showSpoiler ?
                <div className='flex justify-center h-24'>
                    <button
                        className='focus:outline-none text-lg text-gray-700'
                        onClick={() => { setShowSpoiler(true) }}
                    >
                        Show Spoilers
                    </button>
                </div>
                :
                <span className='text-lg text-gray-700 whitespace-pre-line'>{review.content}</span>
            }
        </>
    )
}

const ReviewCard = ({ review }) => {
    return (
        <div className='border border-pink-500 rounded'>
            <div className='bg-pink-500 p-3 text-white'>
                <Link
                    className='text-lg font-semibold'
                    to={`/user/${review.user.username}`}
                >
                    {review.user.username}
                </Link>
                {review.recommended ?
                    <div className='w-min rounded py-1 px-3 hover:bg-white hover:text-pink-500 text-pink-500 bg-white'>
                        <span className='block w-max font-semibold text-lg'>recommends <ThumbUp className='h-8 inline' /></span>
                    </div>
                    :
                    <div className='w-min rounded py-1 px-3 hover:bg-white hover:text-pink-500 text-pink-500 bg-white'>
                        <span className='block w-max font-semibold text-lg'>doesn't recommend <ThumbDown className='h-8 inline' /></span>
                    </div>
                }
                <Link className='block mt-1 w-max' to={`/show/${review.tv_id}`}>{review.title}</Link>
            </div>
            <div className='p-3'>
                <Spoiler review={review} />

            </div>

        </div>
    )
}

export default ReviewCard