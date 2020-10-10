import React, { useState } from 'react'

// project components
import InputField from '../components/InputField'
import Form from '../components/Form'
import Button from '../components/Button'

// project services
import userService from '../services/userService'

const SignUp = () => {
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
      console.log(await userService.register(form))
    } catch (err) {
      console.log(err.response.data)
    }

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
          <Button type='submit' value='Sign Up' />
        </div>
      </Form>
    </>
  )
}

export default SignUp