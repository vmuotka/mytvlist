import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

// project components
import InputField from '../components/InputField'
import Form from '../components/Form'
import Button from '../components/Button'
import Heading from '../components/Heading'

// project services
import userService from '../services/userService'

import { useDispatch, connect } from 'react-redux'
import { login } from '../redux/userReducer'

// project hooks
import { useNotification } from '../context/notification'

const SignUp = ({ user, location }) => {
    // handle referer (if user got redirected to sign in page)
    const referer = location.state ? location.state.referer : '/'
    const { setNotifications } = useNotification()
    const dispatch = useDispatch();



    // handle form field changes
    const [form, setForm] = useState({ username: '', password: '' })

    const handleChange = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }
    // handle form submit
    const handleSubmit = async e => {
        e.preventDefault()
        try {
            dispatch(login(await userService.login(form)))
        } catch (err) {
            setNotifications([{ title: 'Sign In failed', message: 'Incorrect username or password', type: 'error' }])
        }

    }

    // form fields
    const fields = [
        {
            name: 'username',
            type: 'text'
        },
        {
            name: 'password',
            type: 'password'
        }
    ]

    // if logged in, redirect to home page or a page the user tried to access before
    if (user) {
        return <Redirect to={referer} />
    }

    return (
        <>
            <Form className='max-w-xs' onSubmit={handleSubmit} >
                <Heading className='text-center'>Sign in</Heading>
                {
                    fields.map((field, index) =>
                        <div className='mb-4' key={index}>
                            <InputField className='w-full' label={field.name} type={field.type} name={field.name} value={form[field.name]} onChange={handleChange} minLength={field.minLength} required />
                        </div>
                    )
                }
                <div className='text-center mb-2'>
                    <Button className='py-2 px-4' type='submit' value='Sign In' />
                </div>
                <Link className='text-teal-700 text-center' to={{ pathname: '/signup', state: { referer } }}>Don't have an user? Sign up.</Link>
            </Form>
        </>
    )
}

const mapState = (state, ownProps) => {
    return {
        user: state.user,
        location: ownProps.location
    }
}

const connectedSignUp = connect(mapState)(SignUp)

export default connectedSignUp