import React, { useState } from 'react'

// project components
import Form from '../components/Form'
import InputField from '../components/InputField'
import Heading from '../components/Heading'
import TvCard from '../components/TvCard'
import Spinner from '../components/Spinner'
import Pagination from '../components/Pagination'

// project services
import searchService from '../services/searchService'

// project hooks
import { useAuth } from '../context/auth'

const Search = () => {
  const [form, setForm] = useState({ searchword: '' })
  const { authTokens } = useAuth()
  const [response, setResponse] = useState({ results: [], total_results: 0 })
  const [spinner, setSpinner] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  const paginationClick = (page) => async e => {
    window.scrollTo(0, 0)
    setSpinner(true)
    try {
      const res = await searchService.search({ searchword: response.searchword, page }, authTokens)
      setResponse(res)
      setCurrentPage(page)
    } catch (err) {
      console.error(err)
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
    if (form.searchword.length > 0) {
      setSpinner(true)
      try {
        const res = await searchService.search(form, authTokens)
        setResponse(res)
        setCurrentPage(1)
      } catch (err) {
        console.error(err)
      }
      setSpinner(false)
    }
  }

  return (
    <>
      <Form className='max-w-sm mb-4' onSubmit={handleSubmit}>
        <Heading className='text-center'>Search TV shows</Heading>
        <div className='mb4'>
          <InputField className='w-full' label='Search' type='text' value={form.searchword} onChange={handleChange} name='searchword' placeholder='eg. The Owl House' />
        </div>
      </Form>

      <div className='max-w-xl mx-auto'>
        <Spinner className='mx-auto' color='bg-pink-500' show={spinner} />

        {response.results.length > 0 && <p className='mt-4 mb-2 text-sm text-gray-600 font-semibold select-none' title='Some results might be removed because they did not meet our requirements'>Showing {response.results.length} of {response.total_results} result(s)</p>}

        {response.total_pages > 1 && <div className='flex justify-end'><Pagination ariaLabel='Page navigation' currentPage={currentPage} totalPages={7} onClick={paginationClick} /></div>}
        {
          response.results.map((result) => <TvCard className='mt-4' show={result} key={result.id} />)
        }
        {response.total_pages > 1 && <div className='flex justify-end'><Pagination ariaLabel='Page navigation' className='mt-4' currentPage={currentPage} totalPages={response.total_pages} onClick={paginationClick} /></div>}
      </div>
    </>
  )
}

export default Search