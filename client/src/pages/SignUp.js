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
  const referer = props.location.state ? props.location.state.referer : '/'
  const { authTokens, setAuthTokens } = useAuth()
  const { setNotifications } = useNotification()

  // handle form field changes
  const [form, setForm] = useState({ username: '', password: '', confirm: '', email: '' })
  const handleChange = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }
  // handle form submit
  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password === form.confirm) {
      if ((/^(?=[a-zA-Z0-9._]{3,20}$)/).test(form.username)) {
        try {
          setAuthTokens(await userService.register(form))
        } catch (err) {
          const errors = err.response.data.error.errors
          let notificationArray = []
          // eslint-disable-next-line
          for (let [key, error] of Object.entries(errors)) {
            notificationArray.push({ title: error.name, message: error.message, type: 'error' })
          }
          setNotifications(notificationArray)
        }
      } else
        setNotifications([{ title: 'Invalid username', message: 'Check the requirements and try again', type: 'error' }])
    } else {
      setNotifications([{ title: 'Passwords do not match', message: 'Make sure you wrote them correctly', type: 'error' }])
    }
  }

  // if logged in, redirect to home page or a page the user tried to access before
  if (authTokens) {
    return <Redirect to={referer} />
  }

  // form fields
  const fields = [
    {
      name: 'username',
      type: 'text',
      minLength: 3,
      helptext: 'Username can only contain letters A-Z, numbers, underscore and dots. Number of characters must be between 3 and 20.'
    },
    {
      name: 'password',
      type: 'password',
      minLength: 5,
      helptext: 'Password must be atleast 5 characters long.'
    },
    {
      name: 'confirm',
      type: 'password',
      minLength: 5
    },
    {
      name: 'email',
      type: 'email'
    }
  ]
  return (
    <>
      <Form className='max-w-xs' onSubmit={handleSubmit} >
        <Heading className='text-center'>Sign up</Heading>
        {
          fields.map((field, index) =>
            <div className='mb-4' key={index}>
              <InputField className='w-full' label={field.name} type={field.type} name={field.name} value={form[field.name]} onChange={handleChange} minLength={field.minLength} required />
              <div className='text-gray-500 text-sm italic mx-3'>
                {field.helptext}
              </div>
            </div>
          )
        }
        <div className='text-center'>
          <Button className='py-2 px-4 mb-2' type='submit' value='Sign Up' />
        </div>
        <Link className='text-teal-700 text-center' to='/signin'>Already an user? Sign in.</Link>
      </Form>
    </>
  )
}

export default SignUp