import React, { useState, useEffect } from 'react'
import TextAreaAutoSize from 'react-textarea-autosize'

// project components
import ThumbDown from './icons/ThumbDown'
import ThumbUp from './icons/ThumbUp'
import Checkbox from './Checkbox'
import { useAuth } from '../context/auth'
import searchService from '../services/searchService'
import { useNotification } from '../context/notification'
import Dots from './icons/Dots'

const ReviewForm = ({ tv_id, movie_id, title, review }) => {
    const { authTokens } = useAuth()
    const [reviewContent, setReviewContent] = useState('')
    const [recommend, setRecommend] = useState(true)
    const [spoilers, setSpoilers] = useState(false)
    const { setNotifications } = useNotification()
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (review) {
            setRecommend(review.recommended)
            setSpoilers(review.spoilers)
            setReviewContent(review.content)
        }
    }, [review])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        const review = {
            content: reviewContent,
            spoilers,
            recommended: recommend,
            tv_id,
            movie_id,
            title
        }

        try {
            const res = await searchService.saveReview(review, authTokens)
            setNotifications(res)
        } catch (e) {
            setNotifications({ title: 'There was an error.', type: 'error' })
        }
        setIsSaving(false)
    }
    return (
        <form className='border border-pink-500 mt-4 rounded' onSubmit={handleSubmit}>
            <div className='bg-pink-500 w-full p-3'>
                <h2 className='text-2xl font-semibold text-white'>Leave a review</h2>
                <div className='mt-1 text-white'>
                    Do you recommend this?
                    <input
                        type='radio'
                        id='up'
                        name='recommend'
                        className='hidden'
                        checked={recommend}
                        onChange={(e) => setRecommend(true)}
                    />
                    <input
                        type='radio'
                        id='down'
                        name='recommend'
                        className='hidden'
                        checked={!recommend}
                        onChange={(e) => setRecommend(false)}
                    />
                    <div className='flex gap-4 mt-1'>
                        <label
                            htmlFor='up'
                            className={`cursor-pointer rounded py-1 px-3 hover:bg-white hover:text-pink-500 ${recommend && 'text-pink-500 bg-white'}`}
                        >
                            <ThumbUp className='h-8 inline' filled={recommend && 'white'} />
                            <span className='ml-1'>Yes</span>
                        </label>
                        <label
                            htmlFor='down'
                            className={`cursor-pointer rounded py-1 px-3 hover:bg-white hover:text-pink-500 ${!recommend && 'text-pink-500 bg-white'}`}
                        >
                            <ThumbDown className='h-8 inline' filled={!recommend && 'white'} />
                            <span className='ml-1'>No</span>
                        </label>
                    </div>
                </div>
                <Checkbox
                    label='Contains spoilers'
                    className='text-white mt-2'
                    checked={spoilers}
                    onChange={(e) => { setSpoilers(e.target.checked) }}
                />
            </div>
            <TextAreaAutoSize
                placeholder='Write your review here...'
                className='w-full p-2 resize-none focus:outline-none'
                onChange={(e) => { setReviewContent(e.target.value) }}
                value={reviewContent}
                minRows={4}
            />
            <button type='submit' className='bg-pink-500 text-white font-semibold w-full text-lg py-2 border-t-0'>{isSaving ? <Dots className='h-6 inline' /> : 'Save'}</button>
        </form>
    )
}

export default ReviewForm