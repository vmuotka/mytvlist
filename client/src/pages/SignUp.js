import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

// project components
import InputField from '../components/InputField'
import Form from '../components/Form'
import Button from '../components/Button'

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
      try {
        setAuthTokens(await userService.register(form))
      } catch (err) {
        const errors = err.response.data.error.errors
        let notificationArray = []
        for (let [key, error] of Object.entries(errors)) {
          notificationArray.push({ title: error.name, message: error.message, type: 'error' })
        }
        setNotifications(notificationArray)
      }
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
      minLength: 3
    },
    {
      name: 'password',
      type: 'password',
      minLength: 5
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
        {
          fields.map((field, index) =>
            <div className='mb-4' key={index}>
              <label className='block text-sm font-bold mb-2 text-gray-600 capitalize' htmlFor={field.name}>{field.name}</label>
              <InputField className='w-full' type={field.type} name={field.name} value={form[field.name]} onChange={handleChange} minLength={field.minLength} required />
            </div>
          )
        }
        <div className='text-center'>
          <Button className='mb-2' type='submit' value='Sign Up' />
        </div>
        <Link className='text-teal-700 text-center' to='/signin'>Already an user? Sign in.</Link>
      </Form>
    </>
  )
}

export default SignUp