import React, { useState } from 'react'

// project components
import Form from '../../components/Form'
import InputField from '../../components/InputField'
import Heading from '../../components/Heading'
import UserCard from '../../components/UserCard'
import Spinner from '../../components/Spinner'

// project services
import userService from '../../services/userService'

// project hooks
import { useNotification } from '../../context/notification'

const SearchUsers = () => {
    const [form, setForm] = useState({ username: '' })
    const [response, setResponse] = useState({ results: [] })
    const [spinner, setSpinner] = useState(false)
    const { setNotifications } = useNotification()

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
        if (form.username.length >= 0) {
            setSpinner(true)
            try {
                const res = await userService.search(form)
                setResponse(res)
            } catch (err) {
                console.error(err)
                setNotifications([{ title: 'Request failed', message: 'Couln\'t get the requested data.', type: 'error' }])
            }
            setSpinner(false)
        }
    }

    return (
        <>
            <Form className='max-w-sm mb-4' onSubmit={handleSubmit}>
                <Heading className='text-center'>Search Users</Heading>
                <div className='mb4'>
                    <InputField className='w-full' label='Search' type='text' value={form.username} onChange={handleChange} name='username' placeholder='Search by username' />
                </div>
            </Form>

            <div className='max-w-xl mx-auto'>
                <Spinner className='mx-auto' color='bg-pink-500' show={spinner} />
                {response.results.length > 0 && <p className='mt-4 mb-2 text-sm text-gray-600 font-semibold select-none'>Showing {response.results.length} users</p>}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {response.results.length > 0 &&
                        response.results.map(user => <UserCard key={user.id} user={user} />)
                    }
                </div>
            </div>
        </>
    )
}

export default SearchUsers