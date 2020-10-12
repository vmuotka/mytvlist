import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

// project components
import InputField from '../components/InputField'
import Form from '../components/Form'
import Button from '../components/Button'
import Heading from '../components/Heading'

// project services
import userService from '../services/userService'

// project hooks
import { useAuth } from '../context/auth'
import { useNotification } from '../context/notification'

const SignUp = (props) => {
  // handle referer (if user got redirected to sign in page)
  const referer = props.location.state ? props.location.state.referer : '/'
  const { authTokens, setAuthTokens } = useAuth()
  const { setNotifications } = useNotification()



  // handle form field changes
  const [form, setForm] = useState({ username: '', password: '', email: '' })

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
      setAuthTokens(await userService.login(form))
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
  if (authTokens) {
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
          <Button type='submit' value='Sign In' />
        </div>
        <Link className='text-teal-700 text-center' to={{ pathname: '/signup', state: { referer } }}>Don't have an user? Sign up.</Link>
      </Form>
    </>
  )
}

export default SignUp