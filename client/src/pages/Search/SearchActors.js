import React, { useState } from 'react'

// project components
import Form from '../../components/Form'
import InputField from '../../components/InputField'
import Heading from '../../components/Heading'
import ActorCard from '../../components/ActorCard'
import Spinner from '../../components/Spinner'
import Pagination from '../../components/Pagination'

// project services
import actorService from '../../services/actorService'

// project hooks
// import { useAuth } from '../../context/auth'
import { useNotification } from '../../context/notification'

const SearchActors = () => {
    const [form, setForm] = useState({ searchword: '' })
    // const { authTokens } = useAuth()
    const [response, setResponse] = useState({ results: [], total_results: 0 })
    const [spinner, setSpinner] = useState(false)
    const { setNotifications } = useNotification()

    const [currentPage, setCurrentPage] = useState(1)

    const paginationClick = (page) => async e => {
        window.scrollTo(0, 0)
        setSpinner(true)
        try {
            const res = await actorService.search({ searchword: response.searchword, page })
            setResponse(res)
            setCurrentPage(page)
        } catch (err) {
            setNotifications([{ title: 'Request failed', message: 'Couln\'t get the requested data.', type: 'error' }])
        }
        setSpinner(false)
    }

    // handle form field changes
    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const inputs = e.target.querySelectorAll('input')
        inputs.forEach(input =>
            input.blur()
        )
        if (form.searchword.length > 0) {
            setSpinner(true)
            try {
                const res = await actorService.search(form)
                setResponse(res)
                setCurrentPage(1)
            } catch (err) {
                setNotifications([{ title: 'Request failed', message: 'Couln\'t get the requested data.', type: 'error' }])
            }
            setSpinner(false)
        }
    }

    return (
        <>
            <Form className='max-w-sm mb-4' onSubmit={handleSubmit}>
                <Heading className='text-center'>Search Actors</Heading>
                <div className='mb4'>
                    <InputField className='w-full' label='Search' type='text' value={form.searchword} onChange={handleChange} name='searchword' placeholder='eg. Benedict Cumberbatch' />
                </div>
            </Form>

            <div className='max-w-xl mx-auto'>
                <Spinner className='mx-auto' color='bg-pink-500' show={spinner} />

                {response.results.length > 0 && <p className='mt-4 mb-2 text-sm text-gray-600 font-semibold select-none' title='Some results might be removed because they did not meet our requirements'>Showing {currentPage * 20 - 19} - {currentPage * 20 - 20 + response.results.length} of {response.total_results} result(s)</p>}

                {response.total_pages > 1 && <div className='flex justify-end'><Pagination ariaLabel='Page navigation' currentPage={currentPage} totalPages={response.total_pages} onClick={paginationClick} /></div>}
                <div className='flex flex-col gap-2 my-2'>
                    {
                        response.results.map((result) => <ActorCard className='mt-4' actor={result} key={result.id} />)
                    }
                </div>
                {response.total_pages > 1 && <div className='flex justify-end'><Pagination ariaLabel='Page navigation' className='mt-4' currentPage={currentPage} totalPages={response.total_pages} onClick={paginationClick} /></div>}
            </div>
        </>
    )
}

export default SearchActors